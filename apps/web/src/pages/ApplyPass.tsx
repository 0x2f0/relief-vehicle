import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '../lib/i18n';
import { submitApplication } from '../lib/api';
import { saveStoredPass } from '../lib/authTracker';
import { FileText, Truck, MapPin, Package, Check, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { LocationCombobox } from '../components/common/LocationCombobox';

export const ApplyPass = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_phone: '',
    applicant_email: '',
    org_name: '',
    org_type: 'Relief Organization',
    org_id: '',
    vehicle_number: '',
    vehicle_type: 'Truck',
    vehicle_owner: '',
    driver_name: '',
    driver_phone: '',
    passenger_count: 2,
    vehicle_capacity: '5 Tons',
    emergency_contact: '',
    departure_location: '',
    destination: '',
    intermediate_checkpoints: '',
    departure_time: new Date().toISOString().slice(0, 16),
    return_time: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    proposed_route: '',
    travel_purpose: '',
    cargo_type: 'Relief Food & Water',
    cargo_details: '',
    is_emergency: false,
  });

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^(?:(?:\+977)|0)?[9][6-8]\d{8}$|^[0-9]{7,10}$/.test(cleaned);
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      const finalValue = name === 'vehicle_number' ? value.toUpperCase() : value;
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.applicant_name.trim()) {
        newErrors.applicant_name = t('apply.errApplicantName');
      }
      if (!formData.applicant_phone.trim()) {
        newErrors.applicant_phone = t('apply.errPhone');
      } else if (!isValidPhone(formData.applicant_phone)) {
        newErrors.applicant_phone = t('apply.errInvalidPhone');
      }
      if (formData.applicant_email.trim() && !isValidEmail(formData.applicant_email.trim())) {
        newErrors.applicant_email = t('apply.errInvalidEmail');
      }
      if (formData.emergency_contact.trim() && !isValidPhone(formData.emergency_contact)) {
        newErrors.emergency_contact = t('apply.errInvalidPhone');
      }
      if (!formData.org_name.trim()) {
        newErrors.org_name = t('apply.errOrg');
      }
    } else if (currentStep === 2) {
      if (!formData.vehicle_number.trim()) {
        newErrors.vehicle_number = t('apply.errVehicleNo');
      } else if (formData.vehicle_number.trim().length < 3) {
        newErrors.vehicle_number = t('apply.errInvalidVehicleNo');
      }
      if (!formData.driver_name.trim()) {
        newErrors.driver_name = t('apply.errDriverName');
      }
      if (!formData.driver_phone.trim()) {
        newErrors.driver_phone = t('apply.errDriverPhone');
      } else if (!isValidPhone(formData.driver_phone)) {
        newErrors.driver_phone = t('apply.errInvalidPhone');
      }
      if (Number(formData.passenger_count) < 1) {
        newErrors.passenger_count = t('apply.errPassengerCount');
      }
    } else if (currentStep === 3) {
      if (!formData.departure_location.trim()) {
        newErrors.departure_location = t('apply.errFrom');
      }
      if (!formData.destination.trim()) {
        newErrors.destination = t('apply.errTo');
      }
      if (
        formData.departure_location.trim() &&
        formData.destination.trim() &&
        formData.departure_location.trim().toLowerCase() === formData.destination.trim().toLowerCase()
      ) {
        newErrors.destination = t('apply.errSameLocation');
      }
      if (!formData.departure_time) {
        newErrors.departure_time = t('apply.errDepartureTime');
      }
      if (formData.departure_time && formData.return_time) {
        if (new Date(formData.return_time) < new Date(formData.departure_time)) {
          newErrors.return_time = t('apply.errInvalidReturnTime');
        }
      }
    } else if (currentStep === 4) {
      if (!formData.cargo_details.trim()) {
        newErrors.cargo_details = t('apply.errCargo');
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError(Object.values(newErrors)[0]);
      return false;
    }

    setFieldErrors({});
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setError('');
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        proposed_route: formData.proposed_route || `${formData.departure_location} → ${formData.destination}`,
        travel_purpose: formData.travel_purpose || `Emergency relief delivery: ${formData.cargo_type} (${formData.departure_location} to ${formData.destination})`,
        vehicle_owner: formData.vehicle_owner || formData.org_name,
        emergency_contact: formData.emergency_contact || formData.applicant_phone,
      };

      const res = await submitApplication(payload);
      if (res && res.id) {
        saveStoredPass({
          id: res.id,
          token: res.secret_token,
          vehicle: formData.vehicle_number,
          route: `${formData.departure_location} → ${formData.destination}`,
          timestamp: new Date().toISOString(),
        });
        navigate({ to: '/applied/$id', params: { id: res.id } });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.message || t('apply.errSubmit'));
      setLoading(false);
    }
  };

  const stepTitles = [
    { num: 1, title: t('apply.step1'), icon: FileText },
    { num: 2, title: t('apply.step2'), icon: Truck },
    { num: 3, title: t('apply.step3'), icon: MapPin },
    { num: 4, title: t('apply.step4'), icon: Package },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          {t('apply.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t('apply.subtitle')}
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8" aria-label="Form Steps">
        {stepTitles.map((s) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div
              key={s.num}
              className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center space-x-2 transition-colors ${
                isCurrent
                  ? 'bg-blue-50 border-[#0447AF] text-[#0447AF]'
                  : isDone
                  ? 'bg-slate-50 border-slate-300 text-emerald-700'
                  : 'bg-slate-50/50 border-slate-200 text-slate-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isCurrent
                    ? 'bg-[#0447AF] text-white'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="truncate">{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* Validation Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800 text-xs sm:text-sm" role="alert">
          <AlertCircle className="w-5 h-5 text-[#CC1424] flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Applicant & Organization Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.name')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderName')}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.applicant_name
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.applicant_name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.applicant_name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.phone')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="tel"
                  name="applicant_phone"
                  value={formData.applicant_phone}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderPhone')}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.applicant_phone
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.applicant_phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.applicant_phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.email')}
                </label>
                <input
                  type="email"
                  name="applicant_email"
                  value={formData.applicant_email}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderEmail')}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.applicant_email
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.applicant_email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.applicant_email}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.emergencyContact')}
                </label>
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderEmergencyContact')}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.emergency_contact
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.emergency_contact && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.emergency_contact}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.org')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="org_name"
                  value={formData.org_name}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderOrg')}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.org_name
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.org_name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.org_name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.orgType')} <span className="text-[#CC1424]">*</span>
                </label>
                <select
                  name="org_type"
                  value={formData.org_type}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white"
                >
                  <option value="Rescue Team">{t('apply.orgTypeRescue')}</option>
                  <option value="Medical Team">{t('apply.orgTypeMedical')}</option>
                  <option value="Government Agency">{t('apply.orgTypeGov')}</option>
                  <option value="Relief Organization">{t('apply.orgTypeRelief')}</option>
                  <option value="Volunteer Group">{t('apply.orgTypeVolunteer')}</option>
                  <option value="Essential Logistics">{t('apply.orgTypeLogistics')}</option>
                  <option value="Media">{t('apply.orgTypeMedia')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle & Driver Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.vehicleNo')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderVehicleNo')}
                  className={`w-full border rounded-lg p-2.5 text-sm uppercase font-mono font-bold tracking-wider transition-colors bg-white ${
                    fieldErrors.vehicle_number
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.vehicle_number && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.vehicle_number}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.vehicleType')} <span className="text-[#CC1424]">*</span>
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white font-medium"
                >
                  <option value="Motorcycle/Bike">{t('apply.vehicleTypeMotorcycle')}</option>
                  <option value="Scooter">{t('apply.vehicleTypeScooter')}</option>
                  <option value="Ambulance">{t('apply.vehicleTypeAmbulance')}</option>
                  <option value="Jeep/SUV">{t('apply.vehicleTypeJeep')}</option>
                  <option value="Pickup">{t('apply.vehicleTypePickup')}</option>
                  <option value="Truck">{t('apply.vehicleTypeTruck')}</option>
                  <option value="Bus">{t('apply.vehicleTypeBus')}</option>
                  <option value="Microbus/Van">{t('apply.vehicleTypeMicrobus')}</option>
                  <option value="Car/Taxi">{t('apply.vehicleTypeCar')}</option>
                  <option value="Tractor">{t('apply.vehicleTypeTractor')}</option>
                  <option value="Boat/Special">{t('apply.vehicleTypeBoat')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.driverName')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="driver_name"
                  value={formData.driver_name}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderDriverName')}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.driver_name
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.driver_name && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.driver_name}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.driverPhone')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="tel"
                  name="driver_phone"
                  value={formData.driver_phone}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderDriverPhone')}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.driver_phone
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.driver_phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.driver_phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.passengerCount')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  name="passenger_count"
                  value={formData.passenger_count}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.passenger_count
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.passenger_count && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.passenger_count}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.vehicleCapacity')}
                </label>
                <input
                  type="text"
                  name="vehicle_capacity"
                  value={formData.vehicle_capacity}
                  onChange={handleChange}
                  placeholder={t('apply.placeholderCapacity')}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Journey & Route Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.from')} <span className="text-[#CC1424]">*</span>
                </label>
                <div className={fieldErrors.departure_location ? 'ring-1 ring-red-400 rounded-lg' : ''}>
                  <LocationCombobox
                    required
                    name="departure_location"
                    value={formData.departure_location}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, departure_location: val }));
                      setFieldErrors((prev) => ({ ...prev, departure_location: '' }));
                    }}
                    placeholder={t('apply.placeholderFrom')}
                    categories={['District', 'City / Hub', 'Relief Point', 'Checkpoint']}
                  />
                </div>
                {fieldErrors.departure_location && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.departure_location}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.to')} <span className="text-[#CC1424]">*</span>
                </label>
                <div className={fieldErrors.destination ? 'ring-1 ring-red-400 rounded-lg' : ''}>
                  <LocationCombobox
                    required
                    name="destination"
                    value={formData.destination}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, destination: val }));
                      setFieldErrors((prev) => ({ ...prev, destination: '' }));
                    }}
                    placeholder={t('apply.placeholderTo')}
                    categories={['District', 'City / Hub', 'Relief Point', 'Checkpoint']}
                  />
                </div>
                {fieldErrors.destination && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.destination}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.departure')} <span className="text-[#CC1424]">*</span>
                </label>
                <input
                  required
                  type="datetime-local"
                  name="departure_time"
                  value={formData.departure_time}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.departure_time
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.departure_time && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.departure_time}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('apply.return')}
                </label>
                <input
                  type="datetime-local"
                  name="return_time"
                  value={formData.return_time}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                    fieldErrors.return_time
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                  }`}
                />
                {fieldErrors.return_time && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fieldErrors.return_time}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Cargo & Purpose */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('apply.cargo')} <span className="text-[#CC1424]">*</span>
              </label>
              <select
                name="cargo_type"
                value={formData.cargo_type}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF] bg-white font-medium"
              >
                <option value="Relief Food & Water">{t('apply.cargoTypeFood')}</option>
                <option value="Dry Rations & Grains">{t('apply.cargoTypeDryRation')}</option>
                <option value="Ready-to-Eat Food">{t('apply.cargoTypeReadyFood')}</option>
                <option value="Drinking Water & Kits">{t('apply.cargoTypeWater')}</option>
                <option value="Baby Food & Nutrition">{t('apply.cargoTypeBabyFood')}</option>
                <option value="Medical Supplies">{t('apply.cargoTypeMedical')}</option>
                <option value="Rescue Equipment">{t('apply.cargoTypeRescue')}</option>
                <option value="Tents & Tarpaulins">{t('apply.cargoTypeShelter')}</option>
                <option value="Blankets & Warm Clothes">{t('apply.cargoTypeBlankets')}</option>
                <option value="Hygiene Kits">{t('apply.cargoTypeHygiene')}</option>
                <option value="Humanitarian Volunteers">{t('apply.cargoTypeVolunteer')}</option>
                <option value="Essential Logistics">{t('apply.cargoTypeEssential')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('apply.cargoDetails')} <span className="text-[#CC1424]">*</span>
              </label>
              <textarea
                required
                rows={3}
                name="cargo_details"
                value={formData.cargo_details}
                onChange={handleChange}
                placeholder={t('apply.placeholderCargoDetails')}
                className={`w-full border rounded-lg p-2.5 text-sm transition-colors bg-white ${
                  fieldErrors.cargo_details
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                    : 'border-slate-300 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                }`}
              />
              {fieldErrors.cargo_details && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{fieldErrors.cargo_details}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('apply.prev')}</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-[#0447AF] hover:bg-[#033685] text-white text-xs font-bold transition-colors ml-auto shadow-xs"
            >
              <span>{t('apply.next')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-[#CC1424] hover:bg-[#A50E1B] text-white text-sm font-bold transition-colors ml-auto shadow-xs disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? t('apply.submitting') : t('apply.submit')}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

