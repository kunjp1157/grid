"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export function LocationMap({ latitude, longitude, title = "Location" }: LocationMapProps) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin /> {title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Invalid location data provided.</p>
            </CardContent>
        </Card>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005},${latitude - 0.005},${longitude + 0.005},${latitude + 0.005}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MapPin /> {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full rounded-md overflow-hidden border">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          ></iframe>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      </CardContent>
    </Card>
  );
}
