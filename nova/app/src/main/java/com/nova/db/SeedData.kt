package com.nova.db

import android.content.ContentValues
import android.database.sqlite.SQLiteDatabase

object SeedData {

    fun populate(db: SQLiteDatabase) {
        // --- STARS & CONSTELLATIONS ---
        db.execSQL("INSERT INTO stars VALUES (1, 'Polaris', 'North Star', 'Ursa Minor', 2.0, '02h 31m', '+89° 16′', 'north', 'Ultimate navigation star.', 'Points to true north.')")
        db.execSQL("INSERT INTO stars VALUES (2, 'Sirius', 'Dog Star', 'Canis Major', -1.46, '06h 45m', '-16° 43′', 'both', 'Brightest star.', 'Tracks East-West.')")
        db.execSQL("INSERT INTO stars VALUES (3, 'Acrux', 'Alpha Crucis', 'Southern Cross', 0.77, '12h 26m', '-63° 06′', 'south', 'Brightest southern star.', 'Finds South.')")
        db.execSQL("INSERT INTO stars VALUES (4, 'Betelgeuse', '', 'Orion', 0.42, '05h 55m', '+07° 24′', 'both', 'Red supergiant.', 'Rises in east.')")
        db.execSQL("INSERT INTO stars VALUES (5, 'Vega', '', 'Lyra', 0.03, '18h 37m', '+38° 47′', 'north', 'Bright blue star.', 'Nearly overhead in summer.')")
        db.execSQL("INSERT INTO stars VALUES (6, 'Canopus', '', 'Carina', -0.74, '06h 24m', '-52° 41′', 'south', 'Second brightest star.', 'Nav guide in south.')")
        db.execSQL("INSERT INTO stars VALUES (7, 'Arcturus', '', 'Boötes', -0.05, '14h 15m', '+19° 10′', 'both', 'Orange giant.', 'Follow handle of dipper.')")
        db.execSQL("INSERT INTO stars VALUES (8, 'Rigel', '', 'Orion', 0.13, '05h 14m', '-08° 12′', 'both', 'Blue supergiant.', 'Marks foot of Orion.')")

        // --- STAR VISIBILITY ---
        db.execSQL("INSERT INTO star_visibility VALUES (1, 1, 'Egypt', 'All', 22, 32, 0, 'all night', 'Cairo (30°N): Polaris is 30° above north horizon.')")
        db.execSQL("INSERT INTO star_visibility VALUES (2, 1, 'India', 'All', 8, 35, 0, 'all night', 'Delhi (28°N): Polaris is 28° above horizon.')")
        db.execSQL("INSERT INTO star_visibility VALUES (3, 1, 'Kenya', 'North', 0, 5, 0, 'evening', 'At equator, Polaris sits on the horizon.')")
        db.execSQL("INSERT INTO star_visibility VALUES (4, 3, 'Kenya', 'All', -5, 5, 5, 'evening', 'Visible in south. Use to find south.')")
        db.execSQL("INSERT INTO star_visibility VALUES (5, 3, 'South Africa', 'All', -35, -22, 0, 'all night', 'Circumpolar in most of country.')")
        db.execSQL("INSERT INTO star_visibility VALUES (6, 3, 'Tanzania', 'All', -12, -1, 6, 'evening', 'Visible in south. Best June-July.')")
        db.execSQL("INSERT INTO star_visibility VALUES (7, 3, 'Australia', 'All', -44, -10, 0, 'all night', 'Prominent southern feature.')")
        db.execSQL("INSERT INTO star_visibility VALUES (8, 2, 'Global', 'Worldwide', -90, 90, 1, 'evening', 'Visible everywhere. Best Jan-Feb.')")
        db.execSQL("INSERT INTO star_visibility VALUES (9, 1, 'Pakistan', 'North', 24, 37, 0, 'all night', 'Polaris height matches latitude (e.g. Islamabad 33°).')")
        db.execSQL("INSERT INTO star_visibility VALUES (10, 6, 'South America', 'South', -55, 10, 0, 'all night', 'Main southern nav point.')")

        // --- NAVIGATION METHODS ---
        db.execSQL("INSERT INTO navigation_methods VALUES (1, 'Find North using Polaris', '1', 'North', 'all', '1. Cup 2. Pointer stars 3. 5x distance.', '1°', 'easy')")
        db.execSQL("INSERT INTO navigation_methods VALUES (2, 'Find South using Southern Cross', '3', 'South', 'all', '1. Long axis 2. 4.5x length 3. Drop to horizon.', '2-3°', 'medium')")
        db.execSQL("INSERT INTO navigation_methods VALUES (3, 'Orion Method', '4', 'Worldwide', 'winter/summer', '1. Belt rises East, sets West. 2. Face rising = East.', '5°', 'easy')")
        db.execSQL("INSERT INTO navigation_methods VALUES (4, 'Arcturus Arch', '7', 'North', 'spring', 'Follow the curve of the Big Dippers handle.', '5°', 'easy')")

        // --- CONSTELLATIONS ---
        db.execSQL("INSERT INTO constellations VALUES (1, 'Ursa Major', 'Big Dipper', 'north', 'all', '1,7,8', 'Large ladle. 7 bright stars.', 'Pointers edge to Polaris.', 'Global navigation.')")
        db.execSQL("INSERT INTO constellations VALUES (2, 'Orion', 'The Hunter', 'both', 'Nov-Mar', '4,8,13', 'Three stars in belt. Rigel/Betelgeuse.', ' Distinctive belt row.', 'Universal tool.')")
        db.execSQL("INSERT INTO constellations VALUES (3, 'Crux', 'Southern Cross', 'south', 'all', '3,15', 'Small cross shape.', 'Pointer to SCP.', 'Southern navigation.')")

        // --- DIRECTION FINDING ---
        db.execSQL("INSERT INTO direction_finding VALUES (1, 'Shadow Stick', 'Sun', 'both', '1. Mark tip 2. Wait 20m 3. Mark new tip 4. Line is E-W.', 5.0, 'sunny day')")
        db.execSQL("INSERT INTO direction_finding VALUES (2, 'Moon Phases', 'Moon', 'both', 'Crescent left=Waxing (West), right=Waning (East). Full Moon South at midnight (N.Hem).', 15.0, 'clear night')")
        db.execSQL("INSERT INTO direction_finding VALUES (3, 'Watch Method', 'Sun', 'both', 'N.Hem: Hour to sun, split to 12=South. S.Hem: 12 to sun, split to hour=North.', 10.0, 'analog watch')")

        // --- QUICK GUIDES ---
        db.execSQL("INSERT INTO navigation_quick_guide VALUES (1, 'Egypt', 'All', 26.0, 30.0, 'Polaris 26° up.', 'Polaris opposite.', 'Orion belt E-W.', 'Polaris, Orion', 'Summer: Vega.')")
        db.execSQL("INSERT INTO navigation_quick_guide VALUES (2, 'Kenya', 'All', 0.0, 37.0, 'Polaris low North.', 'Southern Cross axis 4.5x.', 'Orion overhead.', 'Southern Cross, Orion', 'Both hemispheres visible.')")
        db.execSQL("INSERT INTO navigation_quick_guide VALUES (3, 'India', 'North', 28.0, 77.0, 'Polaris 28° up.', 'Opposite Polaris.', 'Orion rising SE.', 'Polaris, Big Dipper', 'Cloudy in Monsoon.')")
        db.execSQL("INSERT INTO navigation_quick_guide VALUES (4, 'Pakistan', 'Central', 30.0, 70.0, 'Polaris 30° up North.', 'Opposite Polaris.', 'Orion SE.', 'Polaris', 'Dry clear skies.')")

        // --- MEDICAL: SYMPTOMS & CONDITIONS ---
        db.execSQL("INSERT INTO symptoms VALUES (1, 'Fever', 'hot, pyrexia', 'Body > 38C', 3, 'systemic', 'fever,hot')")
        db.execSQL("INSERT INTO symptoms VALUES (2, 'Headache', 'migraine', 'Head pain', 2, 'nervous', 'pain,head')")
        db.execSQL("INSERT INTO symptoms VALUES (3, 'Cough', 'coughing', 'Expulsion of air', 2, 'respiratory', 'cough')")
        db.execSQL("INSERT INTO symptoms VALUES (4, 'Diarrhea', 'loose stool', 'Watery bowel', 3, 'digestive', 'stomach,loose')")
        db.execSQL("INSERT INTO symptoms VALUES (5, 'Vomiting', 'nausea', 'Emesis', 3, 'digestive', 'stomach')")
        db.execSQL("INSERT INTO symptoms VALUES (7, 'Difficulty Breathing', 'dyspnea', 'Shortness of breath', 4, 'respiratory', 'air,breath')")
        db.execSQL("INSERT INTO symptoms VALUES (10, 'Bleeding', 'blood', 'Hemorrhage', 4, 'systemic', 'bleeding,blood')")
        db.execSQL("INSERT INTO symptoms VALUES (11, 'Muscle Pain', 'aches', 'Myalgia', 2, 'muscular', 'pain,aches')")
        
        db.execSQL("INSERT INTO conditions VALUES (1, 'Malaria', 'Swamp fever', 'Plasmodium parasites', 'Mosquitoes', 'severe', 1, 'malaria')")
        db.execSQL("INSERT INTO conditions VALUES (2, 'Typhoid', 'Enteric fever', 'Salmonella typhi', 'Water', 'severe', 1, 'typhoid')")
        db.execSQL("INSERT INTO conditions VALUES (3, 'Diarrheal Disease', 'Gastro', 'Inflammation', 'Contaminated food', 'moderate', 1, 'stomach')")
        db.execSQL("INSERT INTO conditions VALUES (4, 'Cholera', '', 'Vibrio cholerae', 'Water', 'CRITICAL', 1, 'diarrhea')")
        db.execSQL("INSERT INTO conditions VALUES (5, 'Heatstroke', 'Sunstroke', 'Overheating', 'Sun/Exertion', 'CRITICAL', 0, 'sun')")
        db.execSQL("INSERT INTO conditions VALUES (6, 'Dehydration', '', 'Losing fluids', 'Vomit/Sweat', 'moderate', 0, 'thirst')")
        
        db.execSQL("INSERT INTO symptom_condition_map VALUES (1, 1, 1, 1)")
        db.execSQL("INSERT INTO symptom_condition_map VALUES (2, 4, 3, 1)")
        db.execSQL("INSERT INTO symptom_condition_map VALUES (3, 1, 2, 1)")
        db.execSQL("INSERT INTO symptom_condition_map VALUES (4, 4, 4, 1)")
        db.execSQL("INSERT INTO symptom_condition_map VALUES (5, 5, 4, 1)")

        // --- TREATMENTS & MEDS ---
        db.execSQL("INSERT INTO treatments VALUES (1, 1, 'medication', 'ACT course', '1. Test 2. ACT course 3. Fluids', 'ACT', 'Confirmed', 'Complete course.')")
        db.execSQL("INSERT INTO treatments VALUES (2, 3, 'home_remedy', 'ORS protocol', '1. Mix ORS 2. Sips frequent', 'ORS', 'Mild diarrhea', 'Seek help if bloody.')")
        db.execSQL("INSERT INTO treatments VALUES (3, 4, 'emergency', 'Intense Rehydration', '1. IV Fluids (if possible) 2. Massive ORS 3. Antibiotics', 'ORS, IV', 'Projective diarrhea', 'Urgently seek hospital.')")
        db.execSQL("INSERT INTO treatments VALUES (4, 5, 'emergency', 'Rapid Cooling', '1. Shade 2. Wet cloths 3. Fan 4. sips water', 'Water, Cloths', 'Confusion/High temp', 'Do not submerge in ice.')")
        
        db.execSQL("INSERT INTO medications VALUES (1, 'Paracetamol', 'Acetaminophen', 'Panadol', 'Pain/Fever', '1g q4h', '250mg', 'Oral', 'Liver', 'Max 4g', 'Alcohol', 'pain')")
        db.execSQL("INSERT INTO medications VALUES (2, 'ORS', 'Rehydration Salts', 'Pedialyte', 'Lost fluids', '1 liter', 'Sips', 'Mix 1 liter water', 'Safe', 'Clean water only', 'None', 'ors')")
        db.execSQL("INSERT INTO medications VALUES (3, 'Amoxicillin', '', 'Amoxil', 'Bacterial infection', '500mg tid', '250mg', 'Oral', 'Rash', 'Finish course', 'Allergy', 'antibiotic')")

        // --- EMERGENCY & FIRST AID ---
        db.execSQL("INSERT INTO emergency_procedures VALUES (1, 'Severe Bleeding', 'Life-threatening', 'Spurting', '1. Pressure 2. Elevate', 'Pressure with palm 10m.', 'No remove soaked.', 'Call help.', 'Bandage', 'blood')")
        db.execSQL("INSERT INTO emergency_procedures VALUES (2, 'Choking', 'Critical', 'Clutching throat', '1. 5 Back blows 2. 5 Abdominal thrusts', 'Repeat until clear.', 'No blind sweeps.', 'Call 911/Help.', 'Hands', 'choking')")
        db.execSQL("INSERT INTO first_aid VALUES (1, 'Snake Bite', 'Critical', 'Punctures', '1. Stay still 2. Below heart', 'Wash gently. Mark swelling.', 'Marker', 'Seek medic if diff breathing.', 'Boots', 'venom')")
        db.execSQL("INSERT INTO first_aid VALUES (2, 'Burn (Minor)', 'Mild', 'Redness', '1. Cool water 2. Cover 3. Protect', 'Cool for 20 mins.', 'No butter/ice.', 'If blistering.', 'Water', 'heat')")

        // --- AGRICULTURE ---
        db.execSQL("INSERT INTO crops VALUES (1, 'Maize', 'Zea mays', 'cereal', 'tropical', '120 days', 'medium', 'loam', 'corn')")
        db.execSQL("INSERT INTO crops VALUES (2, 'Rice', 'Oryza sativa', 'cereal', 'tropical', '150 days', 'high', 'clay', 'paddy')")
        db.execSQL("INSERT INTO crops VALUES (3, 'Potato', 'Solanum tuberosum', 'tuber', 'temperate', '90 days', 'medium', 'sandy', 'spud')")
        db.execSQL("INSERT INTO crops VALUES (4, 'Wheat', 'Triticum aestivum', 'cereal', 'moderate', '110 days', 'low', 'loam', 'grain')")
        
        db.execSQL("INSERT INTO planting_guide VALUES (1, 1, 'East Africa', 'Mar-Apr', 'Clear land. Dig 30cm.', '15kg seeds/ha', '75cm rows', '25cm', '5cm', 'Flowering critical.')")
        db.execSQL("INSERT INTO planting_guide VALUES (2, 3, 'Global', 'Spring', 'Loose soil required.', 'Sprouted tubers', 'Hill mounds', '30cm', '15cm', 'Keep buried.')")
        
        db.execSQL("INSERT INTO pests_diseases VALUES (1, 'Fall Armyworm', 'insect', '1,4', 'Holes in leaves', 'Inverted Y head', 'destroy crop', 'pest')")
        db.execSQL("INSERT INTO pests_diseases VALUES (2, 'Late Blight', 'fungus', '3', 'Brown spots', 'White fuzzy growth', 'rot tubers', 'blight')")
        db.execSQL("INSERT INTO pest_control VALUES (1, 1, 'organic', 'Neem spray', 'Moak seeds overnight.', 'Evening application', 'Neem', 'Moderate')")
        db.execSQL("INSERT INTO pest_control VALUES (2, 2, 'chemical', 'Fungicide', 'Apply early morning.', 'Copper based', 'Copper', 'High')")

        // --- MECHANICAL & REPAIR ---
        db.execSQL("INSERT INTO mechanical_issues VALUES (1, 'Bicycle', 'Flat', 'Soft tire', 'Puncture', 'easy')")
        db.execSQL("INSERT INTO mechanical_issues VALUES (2, 'Motorcycle', 'No Start', 'Dead', 'Battery/Plug', 'medium')")
        db.execSQL("INSERT INTO mechanical_issues VALUES (3, 'Car', 'Overheating', 'Steam', 'Coolant leak', 'medium')")
        db.execSQL("INSERT INTO mechanical_issues VALUES (4, 'Water Pump', 'No Flow', 'Dry', 'Air lock/Valves', 'medium')")
        db.execSQL("INSERT INTO mechanical_issues VALUES (5, 'Generator', 'Surging', 'RPM fluctuation', 'Dirty carb', 'hard')")
        
        db.execSQL("INSERT INTO repair_procedures VALUES (1, 1, 'Patching', 'Levers', 'Glue', '1. Remove 2. Mark 3. Patch', '20m', 'Pressure check')")
        db.execSQL("INSERT INTO repair_procedures VALUES (2, 2, 'Starting Diagnosis', 'Wrench', 'Fuel', '1. Kill switch 2. Fuel 3. Battery', '30m', 'No sparks')")
        db.execSQL("INSERT INTO repair_procedures VALUES (3, 4, 'Priming', 'Bucket', 'Water', '1. Open bleeder 2. Pour water 3. Pump manual', '10m', 'Prime must hold')")
        db.execSQL("INSERT INTO repair_procedures VALUES (4, 5, 'Carb Cleaning', 'Screwdriver', 'Cleaner', '1. Remove carb 2. Spray jets 3. Reassemble', '2h', 'Small parts easy to lose')")
        
        db.execSQL("INSERT INTO emergency_repairs VALUES (1, 'Car Overheat', 'HIGH', 'Heater to MAX. Cool for 30m.', 'Check hoses.', 'Water, duct tape')")
        db.execSQL("INSERT INTO emergency_repairs VALUES (2, 'Leaking Pipe', 'MED', 'Turn off main. Apply rubber wrap.', 'Use tire tube.', 'Rubber, wire')")

        // --- MORE STARS ---
        db.execSQL("INSERT INTO stars VALUES (11, 'Procyon', '', 'Canis Minor', 0.34, '07h 39m', '+05° 13′', 'both', 'Bright star.', 'Visible globally.')")
        db.execSQL("INSERT INTO stars VALUES (12, 'Achernar', '', 'Eridanus', 0.46, '01h 37m', '-57° 14′', 'south', 'Bright blue star.', 'Southern point.')")
        db.execSQL("INSERT INTO stars VALUES (13, 'Altair', '', 'Aquila', 0.77, '19h 50m', '+08° 52′', 'both', 'Summer Triangle.', 'Fast rotator.')")
        db.execSQL("INSERT INTO stars VALUES (14, 'Deneb', '', 'Cygnus', 1.25, '20h 41m', '+45° 16′', 'north', 'Distant giant.', 'Part of triangle.')")
        db.execSQL("INSERT INTO stars VALUES (15, 'Fomalhaut', '', 'Piscis Austrinus', 1.16, '22h 57m', '-29° 37′', 'both', 'Autumn star.', 'Isolated brightness.')")

        // --- MORE STAR VISIBILITY ---
        db.execSQL("INSERT INTO star_visibility VALUES (11, 10, 'Australia', 'All', -45, -10, 5, 'evening', 'Red heart of Scorpio overhead.')")
        db.execSQL("INSERT INTO star_visibility VALUES (12, 12, 'New Zealand', 'All', -47, -34, 0, 'all night', 'Prominent in south.')")
        db.execSQL("INSERT INTO star_visibility VALUES (13, 13, 'USA', 'Central', 30, 48, 8, 'evening', 'Peak height in August.')")
        db.execSQL("INSERT INTO star_visibility VALUES (14, 11, 'Greece', 'All', 34, 41, 7, 'evening', 'Procyon visible in evening sky.')")
        db.execSQL("INSERT INTO star_visibility VALUES (15, 15, 'Pakistan', 'South', 24, 30, 10, 'evening', 'Fomalhaut visible in autumn.')")

        // --- MORE MEDICAL ---
        db.execSQL("INSERT INTO symptoms VALUES (12, 'Chills', 'shivering', 'Cold feeling', 2, 'systemic', 'cold')")
        db.execSQL("INSERT INTO symptoms VALUES (13, 'Sweating', 'perspiration', 'Wet skin', 2, 'systemic', 'wet')")
        db.execSQL("INSERT INTO conditions VALUES (7, 'Heat Exhaustion', '', 'Fluid loss', 'Heat', 'moderate', 0, 'sun')")
        db.execSQL("INSERT INTO conditions VALUES (8, 'Dengue', 'Bone break fever', 'Virus', 'Mosquito', 'severe', 0, 'fever')")
        db.execSQL("INSERT INTO symptom_condition_map VALUES (6, 1, 8, 1)")
        db.execSQL("INSERT INTO symptom_condition_map VALUES (7, 12, 1, 1)")
        db.execSQL("INSERT INTO symptom_condition_map VALUES (8, 13, 1, 1)")

        // --- MORE TREATMENTS ---
        db.execSQL("INSERT INTO treatments VALUES (5, 7, 'emergency', 'Cooling & Fluids', '1. Shade 2. ORS 3. Elevate legs', 'Water, ORS', 'Faintness', 'No exertion.')")
        db.execSQL("INSERT INTO treatments VALUES (6, 8, 'medication', 'Supportive care', '1. Paracetamol 2. Rest 3. Fluids', 'Paracetamol', 'Fever/Bone pain', 'No Aspirin.')")

        // --- MORE CROPS ---
        db.execSQL("INSERT INTO crops VALUES (5, 'Cassava', 'Manihot esculenta', 'tuber', 'tropical', '300 days', 'low', 'sandy', 'manioc')")
        db.execSQL("INSERT INTO crops VALUES (6, 'Bean', 'Phaseolus vulgaris', 'legume', 'all', '60 days', 'medium', 'loam', 'pulse')")
        db.execSQL("INSERT INTO planting_guide VALUES (3, 5, 'Tropical', 'Rainy season', 'Cuttings 20cm long.', 'Vertical/Angle', '1m x 1m', '10cm', 'Depth 10cm', 'Harvest roots.')")
        db.execSQL("INSERT INTO planting_guide VALUES (4, 6, 'Global', 'After frost', 'Supports required for poles.', 'Direct seed', 'Double rows', '10cm', '3cm', 'Harvest when dry.')")

        // --- MORE REPAIRS ---
        db.execSQL("INSERT INTO mechanical_issues VALUES (6, 'Solar Panel', 'Low Output', 'No power', 'Dust/Shade', 'easy')")
        db.execSQL("INSERT INTO mechanical_issues VALUES (7, 'Radio', 'Static', 'No signal', 'Antenna/Battery', 'easy')")
        db.execSQL("INSERT INTO repair_procedures VALUES (5, 6, 'Cleaning', 'Cloth', 'Water', '1. Wipe surface 2. Check wiring 3. Angle to sun', '10m', 'No abrasives')")
        db.execSQL("INSERT INTO repair_procedures VALUES (6, 7, 'Signal Boost', 'Wire', 'Wire', '1. Extend antenna 2. Wrap wire 3. Hang high', '5m', 'Lightning risk')")

        // --- MORE FLORA ---
        db.execSQL("INSERT INTO flora VALUES (3, 'Plantain', 'Edible', 'Broad leaves, tall seed stalk.', 'Poultice for bites/Salad')")
        db.execSQL("INSERT INTO flora VALUES (4, 'Yew', 'POISON', 'Red berries, needle leaves.', 'CRITICAL')")
        db.execSQL("INSERT INTO flora VALUES (5, 'Clover', 'Edible', 'Three leaves, white/pink flower.', 'Protein source')")

        // --- MORE WATER ---
        db.execSQL("INSERT INTO water_filtration VALUES (3, 'SODIS', 'UV Rays', '1. Clear bottle 2. Fill water 3. 6 hours in sun', '0.5L / bottle')")
        db.execSQL("INSERT INTO water_filtration VALUES (4, 'Boiling', 'Heat', '1. Fire 2. Pot 3. Continuous boil 1min', 'Unlimited')")

        // Legacy Fallback (Completion)
        val legacy = listOf(
            Triple("medical stomach pain belly ache", "Stomach Relief", "Sip water. No food. Ginger tea."),
            Triple("mechanical car battery jump", "Jumpstart", "Red to Positive, Black to Ground."),
            Triple("farming soil nitrogen compost", "Soil Nutrition", "Add decomposed organic matter or manure."),
            Triple("emergency signal mirror light", "Mirror Signaling", "Aim sunlight at target. Use hole to center."),
            Triple("survival water boil time", "Water Safety", "Boil for at least 1 minute (3 mins at altitude)."),
            Triple("survival fire bow drill wood", "Fire Making", "Use dry softwood for spindle. Friction creates ember."),
            Triple("medical bleeding pressure wound", "Wound Care", "Apply direct pressure with clean cloth. Elevate."),
            Triple("astronomy find north stick", "Shadow Method", "Place stick in ground. Mark shadow end twice (15m apart). Line is E-W."),
            Triple("mechanical pump prime water", "Pump Repair", "Pour water into cylinder to create seal on leather valve."),
            Triple("farming pests neem spray", "Organic Control", "Neem oil disrupts insect growth cycle. Apply at dusk.")
        )
        insertEntries(db, legacy, 1)
    }

    private fun insertEntries(db: SQLiteDatabase, entries: List<Triple<String, String, String>>, priority: Int) {
        for (entry in entries) {
            val values = ContentValues().apply {
                put("keywords", entry.first)
                put("question", entry.second)
                put("answer", entry.third)
                put("priority", priority)
            }
            db.insert("knowledge", null, values)
        }
    }
}
