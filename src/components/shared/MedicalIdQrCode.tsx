
"use client";

import QRCode from "react-qr-code";
import type { User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { useTranslation } from "@/context/LocalizationContext";

interface MedicalIdQrCodeProps {
    user: User;
}

export function MedicalIdQrCode({ user }: MedicalIdQrCodeProps) {
    const { t } = useTranslation();
    const qrData = JSON.stringify({
        name: user.name,
        bloodGroup: user.bloodGroup || 'N/A',
        medicalConditions: user.medicalConditions || 'N/A',
        emergencyContactName: user.emergencyContactName || 'N/A',
        emergencyContactNumber: user.emergencyContactNumber || 'N/A'
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><QrCode /> {t('profile.medicalId.title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <div className="bg-white p-4 rounded-lg">
                    <QRCode
                        value={qrData}
                        size={128}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="L"
                    />
                </div>
                <p className="text-xs text-muted-foreground text-center">{t('profile.medicalId.description')}</p>
            </CardContent>
        </Card>
    );
}
