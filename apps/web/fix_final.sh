#!/bin/bash

# EmergencyBanner.tsx
sed -i 's/import { AlertTriangle, PhoneCall }/import { PhoneCall }/' src/components/layout/EmergencyBanner.tsx

# Navbar.tsx
sed -i 's/Truck, QrCode, MapPin, BarChart3, //g' src/components/layout/Navbar.tsx
sed -i 's/FileText, Activity//g' src/components/layout/Navbar.tsx
sed -i 's/, isOfficer//g' src/components/layout/Navbar.tsx
sed -i 's/user?.name/user?.username/g' src/components/layout/Navbar.tsx
sed -i 's/user?.username/user?.username/g' src/components/layout/Navbar.tsx # just in case

# EPassCard.tsx
sed -i 's/StatusBadge//g' src/components/pass/EPassCard.tsx
sed -i 's/import { PriorityBadge,  } from/import { PriorityBadge } from/g' src/components/pass/EPassCard.tsx

# QRScannerComponent.tsx
sed -i 's/, RefreshCw//g' src/components/scanner/QRScannerComponent.tsx

# useAuth.ts
sed -i 's/res.user/res/g' src/hooks/useAuth.ts

# AdminAuditLogs.tsx
sed -i 's/ShieldCheck, Search, Filter, //g' src/pages/AdminAuditLogs.tsx
sed -i 's/, Clock//g' src/pages/AdminAuditLogs.tsx
sed -i 's/const { isAdmin } = useAuth();/const {} = useAuth();/g' src/pages/AdminAuditLogs.tsx

# AdminLogin.tsx
sed -i '/import { adminLogin }/d' src/pages/AdminLogin.tsx

# ApplyPass.tsx
sed -i '/import { submitApplication }/d' src/pages/ApplyPass.tsx

# CheckpointScanner.tsx
sed -i 's/const { t } = useI18n();//g' src/pages/CheckpointScanner.tsx

# CoordinationCenter.tsx
sed -i 's/BarChart3, //g' src/pages/CoordinationCenter.tsx
sed -i 's/ShieldCheck, //g' src/pages/CoordinationCenter.tsx
sed -i 's/PriorityBadge//g' src/pages/CoordinationCenter.tsx
sed -i 's/import { RoadBadge,  } from/import { RoadBadge } from/g' src/pages/CoordinationCenter.tsx

# RoadConditions.tsx
sed -i '/import { getRoads }/d' src/pages/RoadConditions.tsx

# TrackStatus.tsx
sed -i '/import { trackApplication }/d' src/pages/TrackStatus.tsx

