#!/bin/bash

# 1. Unused React imports
for file in src/components/common/Badge.tsx \
src/components/layout/EmergencyBanner.tsx \
src/components/layout/Footer.tsx \
src/components/layout/Header.tsx \
src/components/layout/Layout.tsx \
src/components/layout/Navbar.tsx \
src/components/pass/EPassCard.tsx \
src/lib/i18n.tsx \
src/pages/AdminAuditLogs.tsx \
src/pages/AdminDashboard.tsx \
src/pages/CheckpointScanner.tsx \
src/pages/CoordinationCenter.tsx \
src/pages/Home.tsx \
src/pages/RoadConditions.tsx \
src/pages/ViewPass.tsx \
src/pages/ApplicationSuccess.tsx; do
  sed -i -E 's/import React, \{/import {/g' "$file"
  sed -i -E "s/import React from 'react';//g" "$file"
done

# 2. Badge.tsx types
sed -i -E 's/PriorityLevel/Priority/g' src/components/common/Badge.tsx
sed -i -E 's/RoadStatus/RoadCondition\["status"\]/g' src/components/common/Badge.tsx

# 3. Header.tsx marquee
sed -i -E 's/<marquee className="flex-1" scrollamount="5">/<div className="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">/g' src/components/layout/Header.tsx
sed -i -E 's/<\/marquee>/<\/div>/g' src/components/layout/Header.tsx

# 4. Navbar.tsx
sed -i -E 's/import \{ Truck, QrCode, MapPin, BarChart3, FileText, Activity, ShieldCheck \} from '"'lucide-react'"';/import { ShieldCheck } from '"'lucide-react'"';/g' src/components/layout/Navbar.tsx
sed -i -E 's/const \{ user, logout, isOfficer \} = useAuth\(\);/const { user, logout } = useAuth();/g' src/components/layout/Navbar.tsx
sed -i -E 's/user\.name/user.username/g' src/components/layout/Navbar.tsx

# 5. EPassCard.tsx
sed -i -E 's/import \{ EPass \} from '\''.\.\/lib\/types'\'';/import { Pass } from '\''.\.\/lib\/types'\'';/g' src/components/pass/EPassCard.tsx
sed -i -E 's/EPass/Pass/g' src/components/pass/EPassCard.tsx
# Unused StatusBadge, Truck, User, Phone, isActive
sed -i -E 's/StatusBadge, //g' src/components/pass/EPassCard.tsx
sed -i -E 's/Truck, User, Phone, //g' src/components/pass/EPassCard.tsx
sed -i -E 's/const isActive = pass\.status === '\''active'\'';//g' src/components/pass/EPassCard.tsx

# 6. QRScannerComponent.tsx
sed -i -E 's/RefreshCw, //g' src/components/scanner/QRScannerComponent.tsx
sed -i -E 's/const \[isScanning, setIsScanning\] = useState\(false\);/const [, setIsScanning] = useState(false);/g' src/components/scanner/QRScannerComponent.tsx

# 7. useAuth.ts
# imports api which doesn't exist, remove it?
