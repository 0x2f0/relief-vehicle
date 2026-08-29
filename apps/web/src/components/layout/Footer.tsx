
import { useI18n } from '../../lib/i18n';
import { PhoneCall, MapPin, Mail, ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { VehicleLogo } from '../common/VehicleLogo';

export const Footer = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0447AF] text-white pt-10 pb-6 mt-auto border-t border-blue-900" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Identity Column */}
          <div className="md:col-span-2 flex flex-col items-start">
            <div className="flex items-center space-x-3 mb-3">
              <VehicleLogo size="md" variant="white" />
              <div>
                <h3 className="text-sm font-semibold text-blue-200">{t('app.subtitle')}</h3>
                <h4 className="text-base font-bold text-white leading-snug">{t('app.title')}</h4>
              </div>
            </div>
            <p className="text-xs text-blue-100 max-w-md leading-relaxed mt-1">
              {t('app.description')}
            </p>
            <div className="mt-4 flex items-center space-x-2 text-xs text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>{t('footer.location')}</span>
            </div>
          </div>
          
          {/* Navigation Links Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 border-b border-blue-800 pb-1.5">
              {t('footer.services')}
            </h4>
            <ul className="space-y-2 text-xs text-blue-100">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-white hover:underline transition-colors">
                  {t('nav.apply')}
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white hover:underline transition-colors">
                  {t('nav.track')}
                </Link>
              </li>
              <li>
                <Link to="/roads" className="hover:text-white hover:underline transition-colors">
                  {t('nav.roads')}
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white hover:underline transition-colors">
                  {t('nav.verify')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Emergency Helplines Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 border-b border-blue-800 pb-1.5 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>{t('footer.hotlines')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-blue-100">
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold text-white">{t('footer.phone1149')}</span>
                <span className="text-blue-200">({t('footer.tollFree')})</span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold text-white">{t('footer.phone1155')}</span>
                <span className="text-blue-200">({t('footer.floodWarning')})</span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold text-white">{t('footer.phone100_102')}</span>
                <span className="text-blue-200">({t('footer.policeAmbulance')})</span>
              </li>
              <li className="flex items-center space-x-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-blue-300" />
                <a href="mailto:contact@rescuerasuwa.com" className="hover:underline hover:text-white transition-colors">
                  contact@rescuerasuwa.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Sub-footer Copyright */}
        <div className="border-t border-blue-800/80 pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-blue-200">
          <p>© {currentYear} {t('footer.powered')}. {t('footer.copyright')}</p>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span className="text-blue-300">{t('footer.gateway')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

