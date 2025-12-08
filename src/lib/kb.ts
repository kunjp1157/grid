export type KBArticle = {
  slug: string;
  title: string;
  category: 'First Aid' | 'Emergency Preparedness';
  content: string;
};

export const articles: KBArticle[] = [
  {
    slug: 'basic-first-aid-burns',
    title: 'Basic First Aid for Burns',
    category: 'First Aid',
    content: `
      For minor burns:
      1. Cool the burn. Hold the burned area under cool (not cold) running water for about 10 minutes.
      2. Remove rings or other tight items from the burned area.
      3. Don't break blisters. Fluid-filled blisters protect against infection.
      4. Apply lotion. Once a burn is completely cooled, apply a lotion, such as one with aloe vera, or a moisturizer.
      5. Bandage the burn. Cover the burn with a sterile gauze bandage (not fluffy cotton).
      
      For major burns, call for emergency medical help immediately.
    `,
  },
  {
    slug: 'cpr-basics',
    title: 'CPR Basics (Hands-Only)',
    category: 'First Aid',
    content: `
      If you see a teen or adult suddenly collapse, you can perform hands-only CPR.
      1. Call for emergency help.
      2. Place one hand on top of the other in the center of the chest.
      3. Push hard and fast. Use your body weight to help you administer compressions that are at least 2 inches deep and delivered at a rate of at least 100 compressions per minute.
      4. Keep pushing until help arrives.
    `,
  },
   {
    slug: 'earthquake-preparedness',
    title: 'What to Do in an Earthquake',
    category: 'Emergency Preparedness',
    content: `
      If you are indoors:
      1. DROP to the ground.
      2. Take COVER by getting under a sturdy table or other piece of furniture.
      3. HOLD ON until the shaking stops.
      
      If you are outdoors:
      1. Stay there.
      2. Move away from buildings, streetlights, and utility wires.
      
      After the earthquake:
      1. Check yourself for injuries.
      2. Expect aftershocks.
      3. If you are in a damaged building, go outside and quickly move away from the building.
    `,
  },
  {
    slug: 'flood-safety',
    title: 'Flood Safety',
    category: 'Emergency Preparedness',
    content: `
      During a flood:
      1. Move to higher ground immediately.
      2. Avoid walking or driving through flood waters. Just six inches of moving water can knock you down, and one foot of moving water can sweep your vehicle away.
      3. Stay informed. Listen to your area's radio and television stations for the latest emergency information.
      
      After a flood:
      1. Avoid floodwaters; they can be contaminated or electrically charged.
      2. Stay away from damaged power lines.
      3. Do not return to your home until authorities say it is safe.
    `,
  }
];
