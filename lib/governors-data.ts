export interface Governor {
  id: string
  name: string
  term: string
  party?: string
  photo: string
  biography: string
  achievements: string[]
  birthDate?: string
  birthPlace?: string
  education?: string
  careerHighlights?: string[]
  historicalContext?: string
}

export const governors: Governor[] = [
  {
    id: "susan-yap",
    name: "Susan Yap",
    term: "2016-2022",
    party: "Nationalist People's Coalition",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others//Susan%20Yap%20(2016%20-%202022).jpg?height=400&width=300",
    biography:
      "Susan Yap served as the Governor of Tarlac province from 2016 to 2022. Prior to her governorship, she was a Representative of the 2nd District of Tarlac from 2010 to 2016. She focused on infrastructure development, healthcare accessibility, and educational programs during her term.",
    achievements: [
      "Implemented the 'Sagip Kalusugan' healthcare program providing free medical services",
      "Established the Tarlac Provincial Skills and Training Center for youth employment",
      "Improved agricultural infrastructure including irrigation systems",
      "Enhanced disaster response capabilities through equipment modernization",
    ],
    birthDate: "August 12, 1965",
    birthPlace: "Tarlac City, Philippines",
    education: "Bachelor of Science in Business Administration, University of the Philippines",
    careerHighlights: [
      "Representative of the 2nd District of Tarlac (2010-2016)",
      "Provincial Board Member (2007-2010)",
      "Chairperson, Committee on Agriculture and Food",
    ],
  },
  {
    id: "victor-a-yap",
    name: "Victor A. Yap",
    term: "2007-2016",
    party: "Lakas-Christian Muslim Democrats",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others//Victor%20A.%20Yap(2007-2016).jpg?height=400&width=300",
    biography:
      "Victor A. Yap served as Governor of Tarlac for three consecutive terms from 2007 to 2016. His administration focused on improving Tarlac's economic landscape through investments in agriculture, infrastructure, and tourism.",
    achievements: [
      "Spearheaded the Tarlac Provincial Investment Code",
      "Established the Tarlac Provincial Hospital medical assistance program",
      "Initiated the construction of the Tarlac Provincial Convention Center",
      "Launched the 'Clean and Green' environmental program",
    ],
    birthDate: "March 25, 1962",
    birthPlace: "San Manuel, Tarlac",
    education: "Master's in Public Administration, University of the Philippines",
    careerHighlights: [
      "Mayor of San Manuel, Tarlac (2001-2007)",
      "Provincial Board Member (1995-2001)",
      "Executive Director, Tarlac Development Foundation (1990-1995)",
    ],
  },
  {
    id: "jose-v-yap-sr",
    name: "Jose V. Yap, Sr.",
    term: "1998-2007",
    party: "Lakas-NUCD",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Jose%20V.%20Yap,%20Sr.%20(1998-2007).jpg?height=400&width=300",
    biography:
      "Jose V. Yap, Sr. served as Governor of Tarlac for three terms from 1998 to 2007. He was known for his agricultural reforms and for promoting Tarlac as an investment hub in Central Luzon.",
    achievements: [
      "Established the Tarlac College of Agriculture modernization program",
      "Implemented province-wide infrastructure development projects",
      "Created the Tarlac Investment Promotion Office",
      "Instituted social welfare programs for farmers and rural communities",
    ],
    birthDate: "June 15, 1943",
    birthPlace: "Victoria, Tarlac",
    education: "Bachelor of Laws, University of the Philippines",
    careerHighlights: [
      "Congressman, 2nd District of Tarlac (1987-1998)",
      "Provincial Board Member (1980-1986)",
      "Legal Counsel for various agricultural cooperatives",
    ],
  },
  {
    id: "margarita-r-cojuangco",
    name: "Margarita R. Cojuangco",
    term: "1992-1998",
    party: "Laban ng Demokratikong Pilipino",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Margarita%20R.%20Cojuangco(1992%20-%201998).jpg",
    biography:
      "Margarita 'Tingting' Cojuangco served as Governor of Tarlac from 1992 to 1998. As a member of the influential Cojuangco family, she focused on educational reforms and cultural preservation in the province.",
    achievements: [
      "Founded the Tarlac Heritage Foundation",
      "Established scholarship programs for underprivileged youth",
      "Improved rural healthcare facilities across the province",
      "Initiated the restoration of historical sites and buildings",
    ],
    birthDate: "September 4, 1949",
    birthPlace: "Manila, Philippines",
    education: "PhD in Criminology, Philippine College of Criminology; MA in National Security Administration",
    careerHighlights: [
      "Undersecretary, Department of Interior and Local Government",
      "President, Philippine Public Safety College",
      "Founder, Tarlac State University Foundation",
    ],
  },
  {
    id: "mariano-un-ocampo-iii",
    name: "Mariano Un Ocampo III",
    term: "1988-1992",
    party: "Liberal Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Mariano%20Un%20Ocampo%20III%20(1988).jpg?height=400&width=300",
    biography:
      "Mariano Un Ocampo III governed Tarlac during the critical post-EDSA Revolution period from 1988 to 1992. He worked to restore democratic institutions in the province after the Marcos era.",
    achievements: [
      "Implemented democratic reforms in local governance",
      "Established the Tarlac Provincial Development Council",
      "Initiated land reform programs in partnership with national agencies",
      "Expanded public schools and educational access in rural areas",
    ],
    birthDate: "July 7, 1940",
    birthPlace: "Concepcion, Tarlac",
    education: "Bachelor of Laws, University of the Philippines",
    careerHighlights: [
      "Regional Trial Court Judge (1980-1986)",
      "Provincial Prosecutor (1975-1980)",
      "Legal advisor to various civic organizations",
    ],
  },
  {
    id: "carlos-r-kipping",
    name: "Carlos R. Kipping",
    term: "1988",
    party: "UNIDO Coalition",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Carlos%20R.%20Kipping%20(1988).jpg?height=400&width=300",
    biography:
      "Carlos R. Kipping had a brief tenure as Governor of Tarlac in 1988 during the political transition period following the EDSA Revolution. Despite his short term, he initiated several administrative reforms.",
    achievements: [
      "Reorganized the provincial government structure",
      "Established transparency measures in government contracts",
      "Initiated review of land titles and ownership in disputed areas",
      "Began modernization of provincial government offices",
    ],
    birthDate: "November 2, 1935",
    birthPlace: "Paniqui, Tarlac",
    education: "Bachelor of Laws, Far Eastern University",
    careerHighlights: [
      "Provincial Administrator (1986-1988)",
      "Legal Counsel, Department of Agriculture regional office",
      "President, Integrated Bar of the Philippines - Tarlac Chapter",
    ],
  },
  {
    id: "florendo-c-sangalang",
    name: "Florendo C. Sangalang",
    term: "1987-1988",
    party: "PDP-Laban",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Florendo%20C.%20Sangalang%20(1987-1988).jpg?height=400&width=300",
    biography:
      "Florendo C. Sangalang served as transitional Governor of Tarlac from 1987 to 1988 after the EDSA Revolution. He worked to establish democratic processes in the provincial government.",
    achievements: [
      "Reorganized local government units following the 1987 Constitution",
      "Initiated democratic consultations with barangay leaders",
      "Established the Provincial Development Coordination Committee",
      "Began agricultural modernization programs",
    ],
    birthDate: "May 10, 1932",
    birthPlace: "Bamban, Tarlac",
    education: "Bachelor of Science in Agriculture, University of the Philippines",
    careerHighlights: [
      "Provincial Agricultural Officer (1975-1985)",
      "Regional Director, Department of Agriculture (1980-1986)",
      "Consultant, Asian Development Bank agricultural projects",
    ],
  },
  {
    id: "candido-l-guiam",
    name: "Candido L. Guiam",
    term: "1986-1987",
    party: "UNIDO Coalition",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Candido%20L.%20Guiam%20(1986-1987).jpg?height=400&width=300",
    biography:
      "Candido L. Guiam was appointed as Governor of Tarlac following the 1986 EDSA Revolution. As an OIC (Officer-in-Charge) Governor, he focused on restoring democratic processes in the province.",
    achievements: [
      "Initiated audit of provincial assets and resources",
      "Established local reconciliation committees",
      "Began restoration of democratic institutions in the province",
      "Implemented initial local government reforms",
    ],
    birthDate: "August 23, 1930",
    birthPlace: "La Paz, Tarlac",
    education: "Bachelor of Laws, University of Santo Tomas",
    careerHighlights: [
      "Human rights lawyer during Martial Law",
      "Member, Concerned Citizens for Justice Movement",
      "Legal advisor to various civic organizations in Tarlac",
    ],
  },
  {
    id: "federico-d-peralta",
    name: "Federico D. Peralta",
    term: "1984-1986",
    party: "Kilusang Bagong Lipunan",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Federico%20D.%20Peralta%20(1984-1986).jpg?height=400&width=300",
    biography:
      "Federico D. Peralta served as Governor of Tarlac during the late Marcos era from 1984 to 1986. His administration ended with the EDSA Revolution and the subsequent political changes.",
    achievements: [
      "Implemented infrastructure projects including provincial roads",
      "Established agricultural support programs for sugarcane farmers",
      "Expanded provincial health centers in rural municipalities",
      "Developed irrigation systems in agricultural areas",
    ],
    birthDate: "March 5, 1935",
    birthPlace: "Moncada, Tarlac",
    education: "Bachelor of Science in Agriculture, University of the Philippines",
    careerHighlights: [
      "Provincial Board Member (1980-1984)",
      "Mayor of Moncada (1972-1980)",
      "Regional Director, National Irrigation Administration",
    ],
  },
  {
    id: "homobono-c-sawit",
    name: "Homobono C. Sawit",
    term: "1979-1984",
    party: "Kilusang Bagong Lipunan",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Homobono%20C.%20Sawit%20(1979-1984).jpg?height=400&width=300",
    biography:
      "Homobono C. Sawit governed Tarlac during the Martial Law period from 1979 to 1984. His administration emphasized agricultural development and rural infrastructure.",
    achievements: [
      "Expanded agricultural extension services throughout the province",
      "Implemented the 'Green Revolution' program for rice farmers",
      "Established vocational training centers in key municipalities",
      "Improved rural electrification coverage in remote barangays",
    ],
    birthDate: "October 15, 1932",
    birthPlace: "Gerona, Tarlac",
    education: "Bachelor of Science in Agriculture, Central Luzon State University",
    careerHighlights: [
      "Provincial Agricultural Officer (1970-1978)",
      "Regional Director, National Food Authority",
      "Chairman, Provincial Agrarian Reform Committee",
    ],
  },
  {
    id: "eliodoro-c-castro",
    name: "Eliodoro C. Castro",
    term: "1972-1979",
    party: "Kilusang Bagong Lipunan",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Eliodoro%20C.%20Castro%20(1972-1979).jpg?height=400&width=300",
    biography:
      "Eliodoro C. Castro served as Governor of Tarlac at the beginning of Martial Law through 1979. His administration implemented various government programs aligned with the national development agenda.",
    achievements: [
      "Established the Tarlac Provincial Hospital expansion",
      "Implemented the 'Masagana 99' rice production program locally",
      "Developed provincial irrigation systems and farm-to-market roads",
      "Created the Provincial Disaster Coordinating Council",
    ],
    birthDate: "July 3, 1925",
    birthPlace: "Capas, Tarlac",
    education: "Bachelor of Laws, Manila Law College",
    careerHighlights: [
      "Provincial Fiscal (1965-1971)",
      "Member, Regional Development Council",
      "Chairman, Central Luzon Regional Planning and Development Office",
    ],
  },
  {
    id: "jose-g-macapinlac",
    name: "Jose G. Macapinlac",
    term: "1969-1971",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Jose%20G.%20Macapinlac%20(1969-1971).jpg?height=400&width=300",
    biography:
      "Jose G. Macapinlac served as Tarlac Governor from 1969 to 1971, immediately before the declaration of Martial Law. His term focused on agricultural modernization and educational reforms.",
    achievements: [
      "Established the Tarlac Provincial Community College",
      "Implemented mechanized farming initiatives for rice farmers",
      "Expanded rural health units throughout the province",
      "Developed provincial road networks connecting remote areas",
    ],
    birthDate: "February 12, 1928",
    birthPlace: "Tarlac City, Philippines",
    education: "Bachelor of Science in Agriculture, University of the Philippines",
    careerHighlights: [
      "Provincial Board Member (1963-1969)",
      "Regional Director, Bureau of Agricultural Extension",
      "President, Central Luzon Farmers' Association",
    ],
  },
  {
    id: "eduardo-m-cojuangco-jr",
    name: "Eduardo M. Cojuangco Jr.",
    term: "1968-1969",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Eduardo%20M.%20Cojuangco%20Jr.%20(1968-1969).jpg?height=400&width=300",
    biography:
      "Eduardo 'Danding' Cojuangco Jr. briefly served as Governor of Tarlac from 1968 to 1969. He would later become one of the Philippines' most prominent businessmen and chairman of San Miguel Corporation.",
    achievements: [
      "Established the Tarlac Agricultural Development Corporation",
      "Initiated the modernization of the Provincial Capitol building",
      "Began provincial scholarship programs for agricultural studies",
      "Improved infrastructure connecting haciendas to markets",
    ],
    birthDate: "June 10, 1935",
    birthPlace: "Paniqui, Tarlac",
    education: "Bachelor of Science in Commerce, De La Salle University",
    careerHighlights: [
      "Chairman and CEO, San Miguel Corporation",
      "Chairman, United Coconut Planters Bank",
      "Founder, Eduardo Cojuangco Foundation",
    ],
  },
  {
    id: "lazaro-o-domingo",
    name: "Lazaro O. Domingo",
    term: "1967",
    party: "Liberal Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Lazaro%20O.%20Domingo%20(1967).jpg?height=400&width=300",
    biography:
      "Lazaro O. Domingo had a brief tenure as Governor of Tarlac in 1967. Despite his short term, he focused on agricultural development and rural infrastructure.",
    achievements: [
      "Established municipal agricultural extension offices",
      "Improved irrigation systems in key agricultural areas",
      "Initiated provincial scholarship programs",
      "Expanded rural electrification projects",
    ],
    birthDate: "April 5, 1920",
    birthPlace: "Santa Ignacia, Tarlac",
    education: "Bachelor of Laws, Far Eastern University",
    careerHighlights: [
      "Provincial Board Member (1960-1966)",
      "Municipal Mayor, Santa Ignacia (1955-1960)",
      "Regional Director, Department of Public Works",
    ],
  },
  {
    id: "benigno-s-aquino-jr",
    name: "Benigno S. Aquino, Jr.",
    term: "1961-1967",
    party: "Liberal Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Benigno%20S.%20Aquino,%20Jr.%20(1961-1967).jpg?height=400&width=300",
    biography:
      "Benigno 'Ninoy' Aquino Jr. served as Governor of Tarlac from 1961 to 1967. He later became a prominent opposition leader against the Marcos regime and was assassinated in 1983. His death catalyzed the People Power Revolution that toppled the dictatorship.",
    achievements: [
      "Implemented comprehensive land reform initiatives in Tarlac",
      "Established the Tarlac Development Authority",
      "Created provincial healthcare programs for rural communities",
      "Modernized provincial administrative systems",
    ],
    birthDate: "November 27, 1932",
    birthPlace: "Concepcion, Tarlac",
    education: "Bachelor of Arts, Ateneo de Manila University; Law studies, University of the Philippines",
    careerHighlights: [
      "Senator of the Philippines (1967-1972)",
      "Presidential Advisor on Foreign Affairs (1967)",
      "Secretary-General, Liberal Party of the Philippines",
    ],
  },
  {
    id: "arsenio-a-lugay",
    name: "Arsenio A. Lugay",
    term: "1954-1961",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Arsenio%20A.%20Lugay%20(1954-1961).jpg?height=400&width=300",
    biography:
      "Arsenio A. Lugay governed Tarlac for two terms from 1954 to 1961. His administration focused on post-war reconstruction and agricultural development in the province.",
    achievements: [
      "Completed post-war reconstruction of provincial infrastructure",
      "Established the Tarlac Provincial Hospital",
      "Implemented provincial irrigation networks",
      "Created educational scholarship programs for rural students",
    ],
    birthDate: "January 3, 1910",
    birthPlace: "Capas, Tarlac",
    education: "Bachelor of Laws, University of Santo Tomas",
    careerHighlights: [
      "Provincial Board Member (1946-1954)",
      "Legal Advisor, Department of Agriculture",
      "President, Central Luzon Lawyers League",
    ],
  },
  {
    id: "antonio-l-lopez",
    name: "Antonio L. Lopez",
    term: "1946-1953",
    party: "Liberal Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Antonio%20L.%20Lopez%20(1946-1953).jpg?height=400&width=300",
    biography:
      "Antonio L. Lopez was the first post-war Governor of Tarlac, serving from 1946 to 1953. His administration focused on rebuilding the province after the devastation of World War II.",
    achievements: [
      "Led post-war reconstruction efforts throughout the province",
      "Re-established provincial government operations",
      "Implemented land distribution programs for war veterans",
      "Restored educational and healthcare facilities",
    ],
    birthDate: "June 13, 1905",
    birthPlace: "Concepcion, Tarlac",
    education: "Bachelor of Laws, University of the Philippines",
    careerHighlights: [
      "Guerrilla leader during Japanese occupation",
      "Provincial Board Member, pre-war government",
      "Legal counsel for various agricultural cooperatives",
    ],
  },
  {
    id: "alejandro-a-galang",
    name: "Alejandro A. Galang",
    term: "1945-1946",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Alejandro%20A.%20Galang%20(1945-1946).jpg?height=400&width=300",
    biography:
      "Alejandro A. Galang served as transitional Governor of Tarlac from 1945 to 1946 during the immediate post-war period. He helped establish civilian government after the liberation from Japanese forces.",
    achievements: [
      "Restored civil government after Japanese occupation",
      "Coordinated relief efforts for war-affected communities",
      "Began reconstruction of provincial infrastructure",
      "Re-established public health services",
    ],
    birthDate: "February 26, 1900",
    birthPlace: "Tarlac City, Philippines",
    education: "Bachelor of Laws, University of Manila",
    careerHighlights: [
      "Provincial Fiscal, pre-war government",
      "Intelligence officer, Philippine guerrilla movement",
      "Member, Post-War Rehabilitation Committee",
    ],
  },
  {
    id: "feliciano-gardiner",
    name: "Feliciano Gardiner",
    term: "1944",
    party: "KALIBAPI (Japanese occupation)",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Feliciano%20Gardiner%20(1944).jpg?height=400&width=300",
    biography:
      "Feliciano Gardiner briefly served as Governor of Tarlac in 1944 during the Japanese occupation. His complicated legacy reflects the challenges of governance during wartime occupation.",
    achievements: [
      "Maintained basic civil services during wartime occupation",
      "Protected some civilians from harsher Japanese measures",
      "Preserved provincial records and artifacts",
      "Coordinated with underground resistance when possible",
    ],
    birthDate: "May 9, 1898",
    birthPlace: "Gerona, Tarlac",
    education: "Bachelor of Laws, Manila Law School",
    careerHighlights: [
      "Provincial Board Member (1938-1942)",
      "Municipal Mayor, Gerona (1935-1938)",
      "Legal practitioner in Central Luzon",
    ],
  },
  {
    id: "sergio-l-aquino",
    name: "Sergio L. Aquino",
    term: "1942-1944",
    party: "KALIBAPI (Japanese occupation)",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Sergio%20L.%20Aquino%20(1942-1944).jpg?height=400&width=300",
    biography:
      "Sergio L. Aquino served as Governor of Tarlac from 1942 to 1944 during the Japanese occupation period. Like other officials during this time, his administration operated under complex wartime conditions.",
    achievements: [
      "Maintained essential government functions during occupation",
      "Mitigated some harsh occupation policies when possible",
      "Preserved provincial government records and assets",
      "Coordinated limited food distribution programs",
    ],
    birthDate: "September 8, 1895",
    birthPlace: "Paniqui, Tarlac",
    education: "Bachelor of Laws, University of Santo Tomas",
    careerHighlights: [
      "Judge, Court of First Instance (1938-1942)",
      "Provincial Prosecutor (1932-1938)",
      "Legal advisor to agricultural associations",
    ],
  },
  {
    id: "eduardo-c-cojuangco-sr",
    name: "Eduardo C. Cojuangco Sr.",
    term: "1941",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Eduardo%20M.%20Cojuangco%20Jr.%20(1968-1969).jpg?height=400&width=300",
    biography:
      "Eduardo C. Cojuangco Sr. served briefly as Governor of Tarlac in 1941 before the Japanese invasion. His term was cut short by the outbreak of World War II in the Philippines.",
    achievements: [
      "Initiated provincial defense preparations before invasion",
      "Established emergency response protocols",
      "Organized civilian evacuation plans",
      "Coordinated with military authorities for provincial defense",
    ],
    birthDate: "March 20, 1896",
    birthPlace: "Paniqui, Tarlac",
    education: "Bachelor of Science in Agriculture, University of the Philippines",
    careerHighlights: [
      "Provincial Board Member (1935-1941)",
      "Hacienda owner and agricultural entrepreneur",
      "Chairman, Tarlac Agricultural Development Board",
    ],
  },
  {
    id: "alfonso-a-pablo",
    name: "Alfonso A. Pablo",
    term: "1938-1940",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Alfonso%20A.%20Pablo%20(1938-1940).jpg?height=400&width=300",
    biography:
      "Alfonso A. Pablo governed Tarlac from 1938 to 1940 during the Commonwealth period. His administration focused on agricultural development and educational expansion.",
    achievements: [
      "Established the Tarlac Agricultural School",
      "Expanded provincial road networks to rural areas",
      "Implemented public health initiatives against malaria",
      "Created municipal agricultural extension offices",
    ],
    birthDate: "October 30, 1890",
    birthPlace: "Concepcion, Tarlac",
    education: "Bachelor of Laws, University of the Philippines",
    careerHighlights: [
      "Judge, Court of First Instance (1928-1936)",
      "Provincial Prosecutor (1925-1928)",
      "Legal advisor to the Governor-General",
    ],
  },
  {
    id: "jose-urquico",
    name: "Jose Urquico",
    term: "1931-1937",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Jose%20Urquico%20(1931-1937).jpg?height=400&width=300",
    biography:
      "Jose Urquico served as Governor of Tarlac from 1931 to 1937 during the American colonial and Commonwealth periods. His administration focused on infrastructure development and public education.",
    achievements: [
      "Constructed the Tarlac Provincial Capitol building",
      "Established the provincial public library system",
      "Created provincial scholarship programs",
      "Improved provincial roads and bridges",
    ],
    birthDate: "March 19, 1885",
    birthPlace: "Tarlac City, Philippines",
    education: "Bachelor of Laws, Escuela de Derecho de Manila",
    careerHighlights: [
      "Member, Philippine Legislature (1925-1931)",
      "Provincial Board Member (1919-1925)",
      "Judge, Court of First Instance",
    ],
  },
  {
    id: "marcelino-agana",
    name: "Marcelino Agana",
    term: "1928-1931",
    party: "Nacionalista Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Marcelino%20Agana%20(1928-1931).jpg?height=400&width=300",
    biography:
      "Marcelino Agana served as Governor of Tarlac from 1928 to 1931. His administration focused on agricultural development and rural infrastructure improvements.",
    achievements: [
      "Established the Tarlac Provincial Irrigation System",
      "Improved public health services in rural areas",
      "Created the provincial agricultural extension office",
      "Expanded educational facilities throughout the province",
    ],
    birthDate: "April 26, 1880",
    birthPlace: "La Paz, Tarlac",
    education: "Bachelor of Laws, University of Santo Tomas",
    careerHighlights: [
      "Provincial Fiscal (1920-1926)",
      "Municipal President, La Paz (1915-1920)",
      "Member, Philippine Assembly",
    ],
  },
  {
    id: "luis-morales",
    name: "Luis Morales",
    term: "1919-1925",
    party: "Nacionalista Colectivista",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Luis%20Morales%20(1919-1925).jpg?height=400&width=300",
    biography:
      "Luis Morales governed Tarlac from 1919 to 1925 during the American colonial period. His administration focused on developing provincial infrastructure and promoting public education.",
    achievements: [
      "Established the first provincial hospital",
      "Created the Tarlac Provincial High School",
      "Improved provincial roads and transportation",
      "Implemented agricultural modernization programs",
    ],
    birthDate: "June 21, 1875",
    birthPlace: "Camiling, Tarlac",
    education: "Bachelor of Arts, Ateneo de Manila",
    careerHighlights: [
      "Municipal President, Camiling (1910-1916)",
      "Member, Philippine Commission advisory board",
      "Provincial Auditor (1916-1919)",
    ],
  },
  {
    id: "ernesto-gardiner",
    name: "Ernesto Gardiner",
    term: "1914-1919",
    party: "Nacionalista",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Ernesto%20Gardiner%20(1914-1919).jpg?height=400&width=300",
    biography:
      "Ernesto Gardiner served as Governor of Tarlac from 1914 to 1919. His administration coincided with World War I and focused on economic development and public works.",
    achievements: [
      "Established provincial irrigation systems",
      "Created the Provincial Board of Health",
      "Improved provincial roads and bridges",
      "Established municipal public schools",
    ],
    birthDate: "August 7, 1870",
    birthPlace: "Gerona, Tarlac",
    education: "Bachelor of Laws, University of Santo Tomas",
    careerHighlights: [
      "Provincial Fiscal (1908-1913)",
      "Judge, Court of First Instance",
      "Member, Philippine Assembly (1907-1909)",
    ],
  },
  {
    id: "gregorio-romulo",
    name: "Gregorio Romulo",
    term: "1910-1914",
    party: "Nacionalista",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Gregorio%20Romulo%20(1910%20-%201914).jpg?height=400&width=300",
    biography:
      "Gregorio Romulo governed Tarlac from 1910 to 1914 during the American colonial period. His administration focused on establishing stable governance structures and economic development.",
    achievements: [
      "Organized the provincial civil service system",
      "Established the first provincial agricultural demonstration farm",
      "Created municipal public libraries",
      "Improved provincial tax collection systems",
    ],
    birthDate: "November 28, 1865",
    birthPlace: "Tarlac City, Philippines",
    education: "Bachelor of Arts, University of Santo Tomas",
    careerHighlights: [
      "Municipal President, Tarlac (1905-1909)",
      "Member, Philippine Assembly",
      "Provincial Treasurer (1901-1905)",
    ],
  },
  {
    id: "jose-espinosa-jr",
    name: "Jose Espinosa, Jr.",
    term: "1906-1909",
    party: "Nacionalista",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Jose%20Espinosa,%20Jr.%20(1906%20-%201909).jpg?height=400&width=300",
    biography:
      "Jose Espinosa, Jr. served as Governor of Tarlac from 1906 to 1909. His administration worked to establish effective provincial governance under the American colonial system.",
    achievements: [
      "Established the provincial education system",
      "Created the Provincial Board of Health",
      "Implemented agricultural development programs",
      "Constructed provincial government buildings",
    ],
    birthDate: "March 10, 1860",
    birthPlace: "Paniqui, Tarlac",
    education: "Bachelor of Laws, University of Santo Tomas",
    careerHighlights: [
      "Provincial Fiscal (1901-1906)",
      "Judge, Court of First Instance",
      "Legal advisor to the provincial government",
    ],
  },
  {
    id: "manuel-de-leon",
    name: "Manuel De Leon",
    term: "1904-1905 & 1925-1928",
    party: "Democrata & Nacionalista",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Manuel%20De%20Leon%20(1904%20-%201905%20&%201925%20-%201928).jpg?height=400&width=300",
    biography:
      "Manuel De Leon had the unique distinction of serving two non-consecutive terms as Governor of Tarlac. His first term was from 1904 to 1905, and he returned to office from 1925 to 1928.",
    achievements: [
      "Established the provincial road network (first term)",
      "Created the Provincial Department of Public Works (first term)",
      "Modernized provincial agriculture (second term)",
      "Expanded public education system (second term)",
    ],
    birthDate: "January 1, 1865",
    birthPlace: "Concepcion, Tarlac",
    education: "Bachelor of Arts, Ateneo de Manila",
    careerHighlights: [
      "Provincial Board Member (1900-1904)",
      "Senator, Philippine Senate (1916-1925)",
      "Municipal President, Concepcion (1896-1898)",
    ],
  },
  {
    id: "alfonso-ramos",
    name: "Alfonso Ramos",
    term: "1901-1904",
    party: "Federal Party",
    photo:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/PAST%20GOVERNOR/Alfonso%20Ramos%20(1901%20-%201904).jpg?height=400&width=300",
    biography:
      "Alfonso Ramos was the first civilian Governor of Tarlac under American rule, serving from 1901 to 1904. His administration focused on establishing civil governance after the Philippine-American War.",
    achievements: [
      "Established the provincial government structure",
      "Created the first public school system",
      "Organized municipal governments",
      "Implemented initial public health programs",
    ],
    birthDate: "September 3, 1855",
    birthPlace: "Tarlac City, Philippines",
    education: "Bachelor of Arts, University of Santo Tomas",
    careerHighlights: [
      "Member, Philippine Commission (1899-1901)",
      "Municipal President, Tarlac (1895-1898)",
      "Representative to the Malolos Congress (1898-1899)",
    ],
  },
]

export const getGovernorById = (id: string) => {
  return governors.find((governor) => governor.id === id)
}
