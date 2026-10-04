"""Generates dataset.csv for the FixNepal service-category classifier.

Each row = one customer problem description + its service category.
`group` identifies the underlying problem phrase, so that the notebook can split
train/test by group (no near-duplicate sentences leak across the split).
"""
import random, csv

random.seed(42)

PROBLEMS = {
    "Plumbing": [
        "my kitchen tap is leaking", "the water pipe burst", "bathroom sink is blocked",
        "toilet is not flushing properly", "the water tank is overflowing", "no water pressure in the shower",
        "drain is clogged and smells bad", "need to install a new water filter", "the geyser is leaking water",
        "washbasin needs to be fixed", "pipe joint is dripping under the sink", "water motor pump is not pulling water",
        "commode seat is broken", "tap bata pani aayena", "dhara bata pani chuhiyeko cha",
        "toilet jam bhayo", "pani ko pipe phutyo", "bathroom ko nali block bhayo",
        "need a plumber to fix the water line", "shower head replacement required",
            "water is leaking from the ceiling pipe",
        "need a new tap installed in the kitchen",
        "the sink drain is slow and blocked",
        "overhead water tank pipe is cracked",
        "bathroom pipe fitting required",
        "toilet flush tank is leaking water",
        "hot water pipe is not working in the bathroom",
        "septic tank line is blocked",
        "washing area tap is broken",
        "water pump pipe needs repair",
        "pani ko tap lagaunu paryo",
        "sink ma pani rukयो",
        "toilet ko pipe leak bhayo",
        "bathroom ma pani aayena",
        "nali ra pipe thik garnu paryo",
        "plumber chahiyo pani chuhiyeko cha",
        "sewage drain is overflowing",
        "water supply pipe replacement",
        "basin tap is loose and dripping",
        "geyser pipe connection is broken",
],
    "Electrical": [
        "the lights are flickering", "power socket is sparking", "need to install a ceiling fan",
        "main switch keeps tripping", "the wiring in my house is old and unsafe", "fan is not rotating",
        "inverter is not charging", "need new switchboard fitted", "bulb holder is burnt",
        "the meter board has a short circuit", "no electricity in one room", "need led lights installed in the hall",
        "mcb keeps tripping again and again", "bijuli gayo ghar ma", "switch bata current lagyo",
        "batti baleko chaina", "pankha ghumdaina", "wire jhulkera chingari aayo",
        "need an electrician for house wiring", "doorbell is not working",
            "need to install new electric sockets",
        "light switch is not working",
        "house is getting electric shocks",
        "extension wiring needed in the new room",
        "tube light and bulbs need to be changed",
        "electric fan regulator is faulty",
        "the circuit breaker is burning",
        "need solar panel wiring connected",
        "no power supply in the kitchen",
        "electric meter wire is loose",
        "bijuli ko wiring garnu paryo",
        "light on off hunchha",
        "socket ma current chhaina",
        "mcb ra switch thik garnu paryo",
        "ghar ma naya batti lagaunu paryo",
        "electrician chahiyo wiring ko lagi",
        "fuse keeps blowing",
        "need an inverter connection fitted",
        "the electric heater is giving shock",
        "stairs lights are not working",
],
    "Appliance Repair": [
        "my washing machine stopped working", "the refrigerator is not cooling", "air conditioner is not cooling the room",
        "television screen has no display", "microwave is not heating food", "laptop is not turning on",
        "door lock is jammed", "the wooden door hinge is broken", "sofa needs repair",
        "mobile phone screen is cracked", "furniture drawer is stuck", "gas stove burner is not igniting",
        "rice cooker is dead", "fridge le cooling gardaina", "washing machine ma awaj aayo",
        "tv ko screen kaalo bhayo", "ghar ko darwaja bigriyo", "ac ma pani chuhiyeko cha",
        "need a technician to repair my appliance", "cupboard door has come off",
            "need a technician for my refrigerator",
        "my oven stopped heating",
        "water purifier is not working",
        "car seat and door handle repair",
        "my bike needs servicing",
        "the cupboard hinge is broken",
        "computer is very slow and shuts down",
        "printer is not printing",
        "bed frame is broken",
        "window latch is damaged",
        "geyser is not heating water, please repair",
        "ceiling fan motor needs repair",
        "mobile ko charger port kharab bhayo",
        "fridge repair garnu paryo",
        "tv remote ra display thik garnu paryo",
        "washing machine kharab bhayo",
        "ghar ko furniture mistri chahiyo",
        "kitchen ko cabinet repair garnu paryo",
        "air cooler is making noise and needs fixing",
        "table leg is broken and needs fixing",
],
    "Basic Cleaning": [
        "need deep cleaning of my house", "office cleaning required every week", "sofa and carpet cleaning needed",
        "kitchen is very greasy and needs cleaning", "water tank cleaning service", "move out cleaning for my flat",
        "bathroom tiles are stained and need scrubbing", "window and glass cleaning", "post construction cleaning needed",
        "mattress cleaning and sanitizing", "need a maid for daily house cleaning", "garden and terrace cleaning",
        "ghar safa garnu paryo", "kitchen ko safai garnu cha", "karpet dhulai garnu paryo",
        "paani tanki safa garna", "office ko safai ko lagi manchhe chahiyo", "bathroom chamkaunu paryo",
        "need professional cleaners for the apartment", "carpet has stains and dust",
            "need a cleaner for my room",
        "house needs dusting and mopping",
        "apartment needs full sanitization",
        "swimming pool and terrace cleaning",
        "clean the kitchen cabinets and floor",
        "need curtain and sofa washing",
        "cleaning service for a new flat before moving in",
        "floor polishing and scrubbing",
        "restaurant kitchen deep clean",
        "need cleaners for my shop",
        "ghar ko dhulo safa garna",
        "jhyal ra bhui safa garne manche",
        "bathroom ra toilet dhulai garnu paryo",
        "sofa ra mattress safai",
        "naya ghar ma safai ko lagi",
        "cleaner chahiyo hapta ma ek patak",
        "pest and dust cleanup after renovation",
        "rooftop water tank washing",
        "need housekeeping staff for daily cleaning",
        "bedroom and living room deep clean",
],
}

PREFIX = ["", "", "", "please help, ", "urgent: ", "hello, ", "i need help, ", "can someone come today? ",
          "hi, ", "need a service: ", "help! ", "looking for a provider, "]
SUFFIX = ["", "", "", " please", " asap", " in kathmandu", " in lalitpur", " in pokhara", " today",
          " as soon as possible", " this weekend", " thank you", " in bhaktapur", " near my home"]

rows = []
for cat, phrases in PROBLEMS.items():
    for gid, p in enumerate(phrases):
        seen = set()
        while len(seen) < 3:
            text = (random.choice(PREFIX) + p + random.choice(SUFFIX)).strip()
            if random.random() < 0.15:           # simulate typos: drop a random character
                i = random.randrange(len(text))
                text = text[:i] + text[i + 1:]
            seen.add(text)
        for t in seen:
            rows.append((t, cat, f"{cat[:3].lower()}_{gid}"))

random.shuffle(rows)
with open("dataset.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["text", "category", "group"])
    w.writerows(rows)
print(len(rows), "rows")
