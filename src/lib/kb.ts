
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
    slug: 'bleeding-control',
    title: 'How to Control Bleeding',
    category: 'First Aid',
    content: `
      For severe bleeding:
      1. Cover the wound with a sterile gauze or clean cloth.
      2. Apply direct, firm pressure with your hands until the bleeding stops.
      3. Do not remove the cloth. If blood soaks through, add more cloth on top and continue to apply pressure.
      4. Elevate the injured limb above the level of the heart, if possible.
      5. If bleeding is severe and does not stop with direct pressure, call for emergency medical help.
    `,
  },
  {
    slug: 'choking-first-aid',
    title: 'First Aid for Choking (Adult)',
    category: 'First Aid',
    content: `
      If the person can cough or speak, encourage them to keep coughing. If they cannot breathe, cough, or speak:
      1. Give 5 back blows. Stand to the side and slightly behind a choking adult. Place one arm across the person's chest for support. Bend the person over at the waist so that the upper body is parallel with the ground. Deliver five separate back blows between the person's shoulder blades with the heel of your hand.
      2. Give 5 abdominal thrusts (Heimlich maneuver). Stand behind the person. Make a fist with one hand. Place the thumb side of your fist against the person's upper abdomen, just above the navel. Grasp your fist with your other hand. Press hard into the abdomen with a quick, upward thrust — as if trying to lift the person up.
      3. Alternate between 5 blows and 5 thrusts until the blockage is dislodged.
    `,
  },
  {
    slug: 'emergency-kit',
    title: 'Building a Basic Emergency Kit',
    category: 'Emergency Preparedness',
    content: `
      A basic emergency supply kit could include the following recommended items:
      - Water: one gallon of water per person per day for at least three days, for drinking and sanitation.
      - Food: at least a three-day supply of non-perishable food.
      - Battery-powered or hand crank radio and a NOAA Weather Radio with tone alert.
      - Flashlight and extra batteries.
      - First aid kit.
      - Whistle to signal for help.
      - Dust mask to help filter contaminated air.
      - Moist towelettes, garbage bags and plastic ties for personal sanitation.
      - Wrench or pliers to turn off utilities.
      - Can opener for food (if kit contains canned food).
      - Local maps.
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
  },
  {
    slug: 'power-outage-safety',
    title: 'Power Outage Safety',
    category: 'Emergency Preparedness',
    content: `
      During a power outage:
      1. Keep freezers and refrigerators closed. Food will stay frozen for 36 to 48 hours in a full, unopened freezer.
      2. Use flashlights for emergency lighting. Avoid using candles.
      3. Disconnect appliances and electronics to avoid damage from electrical surges.
      4. If you use a generator, use it OUTDOORS and away from windows.
      5. Do not use a gas stove to heat your home.
    `,
  }
];
