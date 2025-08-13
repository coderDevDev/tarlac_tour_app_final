export interface HeritageSite {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  history: string
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  videos?: string[]
  modelUrl?: string
  qrCode?: string
  audioDescription?: string
}

// Original heritage sites
export const heritageSites: HeritageSite[] = [
  {
    id: "ninoy-aquino-ancestral-house",
    name: "Ninoy Aquino Ancestral House",
    shortDescription:
      "The ancestral home of Senator Benigno 'Ninoy' Aquino Jr., a significant figure in Philippine history.",
    fullDescription:
      "The Aquino Ancestral House in Concepcion, Tarlac is a historical landmark that served as the home of the Aquino family. It houses memorabilia and personal belongings of the late Senator Benigno 'Ninoy' Aquino Jr. and his family, offering visitors a glimpse into their private lives and Ninoy's political journey.",
    history:
      "Built in the early 20th century, this ancestral house belonged to General Servillano Aquino, Ninoy's grandfather. Ninoy spent his childhood years here before becoming a prominent political figure who opposed the Marcos dictatorship. After his assassination in 1983, the house became a symbol of the Filipinos' struggle for democracy and freedom.",
    location: {
      address: "Concepcion, Tarlac, Philippines",
      coordinates: {
        lat: 15.3267,
        lng: 120.6567,
      },
    },
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipOHac2U3thLu7iZxjsxX8R-Ipucp7gawz0x0ztL=s1360-w1360-h1020",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%201.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%202.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%203.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%204.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%205.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%206.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%207.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%208.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Ninoy%20house%209.JPG",
    ],
    videos: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ANCESTRAL%20HOUSE/Aquino%20Ancestral%20House.mp4",
    ],
    modelUrl:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/tripo_pbr_model_a166a5fc-95b0-429f-846f-53e9cd31c0f8.glb",
    qrCode: "/qr-codes/ninoy-house.png",
    audioDescription:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/ANCESTRAL%20HOUSE-20250425T062338Z-001/ElevenLabs_2025-04-25T06_53_06_Mark%20-%20Natural%20Conversations_pvc_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    id: "capas-national-shrine",
    name: "Capas National Shrine",
    shortDescription:
      "A memorial dedicated to the Filipino and American soldiers who died during the Bataan Death March.",
    fullDescription:
      "The Capas National Shrine is a 54-hectare memorial in Tarlac dedicated to the Filipino and American soldiers who died during World War II. The shrine features a 70-meter obelisk, memorial walls inscribed with the names of those who perished, and a museum that houses artifacts and exhibits related to the war.",
    history:
      "During World War II, the site served as Camp O'Donnell, a concentration camp where approximately 60,000 Filipino and American prisoners of war were held after the infamous Bataan Death March. Thousands died due to disease, malnutrition, and harsh treatment. In 1991, the Philippine government established the shrine to honor these fallen heroes.",
    location: {
      address: "Capas Shrine Museum, New Clark City, Capas, Tarlac",
      coordinates: {
        lat: 15.3342,
        lng: 120.5895,
      },
    },
    images: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Capas%20Shrine%201.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Capas%20Shrine%203.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Capas%20Shrine%204.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Capas%20Shrine%205.JPG",
    ],
    videos: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Capas%20National%20Shrine.mp4",
    ],
    modelUrl:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/CAPAS%20NATIONAL%20SHRINE/tripo_pbr_model_c91ef8c4-8cdf-45c0-b0e9-ea2a0c7776ee.glb",
    qrCode: "/qr-codes/capas-shrine.png",
    audioDescription:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/CAPAS%20NATIONAL%20SHRINE/ElevenLabs_2025-04-25T06_54_45_Mark%20-%20Natural%20Conversations_pvc_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    id: "capas-death-march-monument",
    name: "Capas Death March Monument",
    shortDescription: "A monument commemorating the end point of the Bataan Death March during World War II.",
    fullDescription:
      "The Capas Death March Monument marks the endpoint of the infamous Bataan Death March, where Filipino and American prisoners of war were forced to march approximately 106 kilometers from Bataan to Tarlac. The monument stands as a solemn reminder of the suffering endured by these prisoners during World War II.",
    history:
      "The Bataan Death March began on April 9, 1942, after the surrender of the Bataan Peninsula. Approximately 60,000-80,000 Filipino and American prisoners of war were forced by the Japanese Imperial Army to march to Camp O'Donnell in Capas, Tarlac. Thousands died along the way due to physical abuse, starvation, and disease. This monument was erected to commemorate their sacrifice and suffering.",
    location: {
      address: "MacArthur Hwy, Capas, Tarlac",
      coordinates: {
        lat: 15.3289,
        lng: 120.5923,
      },
    },
    images: [
      "https://www.capastarlac.gov.ph/wp-content/uploads/photo-gallery/Tourism/Death_March_Monument/Death_March_Monument_-_Capas_Tarlac_(5)-min.jpg",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/Death%20March%201.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/Death%20March%202.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/Death%20March%203.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/Death%20March%204.JPG",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/Death%20March.JPG",
    ],
    videos: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/Capas%20Death%20March%20Memorial.mp4",
    ],
    modelUrl:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/tripo_pbr_model_2a904419-4acc-4692-8e27-0d9aa87ac0ca.glb",
    qrCode: "/qr-codes/death-march-monument.png",
    audioDescription:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/DEATH%20MARCH/ElevenLabs_2025-04-25T06_55_47_Mark%20-%20Natural%20Conversations_pvc_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    id: "tarlac-cathedral",
    name: "Tarlac Cathedral",
    shortDescription:
      "Also known as San Sebastian Cathedral, this is the seat of the Roman Catholic Diocese of Tarlac.",
    fullDescription:
      "The San Sebastian Cathedral, commonly known as Tarlac Cathedral, is a Roman Catholic church located in the heart of Tarlac City. As the seat of the Diocese of Tarlac, it serves as the central church for Catholics in the province. The cathedral features beautiful stained glass windows, intricate woodwork, and religious artifacts.",
    history:
      "The cathedral was originally built in the late 19th century but has undergone several renovations and reconstructions over the years. It was elevated to the status of a cathedral when the Diocese of Tarlac was established in 1963. The church played a significant role during the Philippine Revolution against Spanish colonization and has witnessed many historical events in Tarlac's history.",
    location: {
      address: "F. Tañedo St, Tarlac City, Tarlac",
      coordinates: {
        lat: 15.4883,
        lng: 120.5953,
      },
    },
    images: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Cathedral_6.JPG?height=600&width=800",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/catherral%2010.JPG?height=600&width=800",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/catherdral%2011.JPG?height=600&width=800",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Cathedral.JPG?height=600&width=800",
    ],
    modelUrl:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/CATHEDRAL/tripo_pbr_model_411bd823-761b-4a6a-a953-e2c93253514b.glb",
    qrCode: "/qr-codes/tarlac-cathedral.png",
    videos: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/San%20Sebastian%20Cathedral_4.mp4",
    ],
    audioDescription:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/CATHEDRAL/ElevenLabs_2025-04-25T06_56_52_Mark%20-%20Natural%20Conversations_pvc_sp100_s50_sb75_se0_b_m2.mp3",
  },
  {
    id: "monasterio-de-tarlac",
    name: "Monasterio de Tarlac",
    shortDescription: "A monastery on top of Mount Resurrection that houses a relic of the True Cross of Jesus Christ.",
    fullDescription:
      "The Monasterio de Tarlac is a monastery located on top of Mount Resurrection in San Jose, Tarlac. It is home to the Servants of the Risen Christ Monastic Community and houses a relic of the True Cross of Jesus Christ. The monastery offers breathtaking views of the surrounding countryside and serves as a place of pilgrimage and spiritual retreat.",
    history:
      "Established in the early 2000s, the Monasterio de Tarlac was founded by Fr. Archie Cortez. In 2005, the monastery received a relic of the True Cross of Jesus Christ from the Vatican, making it a significant pilgrimage site for Catholics. The 30-foot statue of the Risen Christ on the monastery grounds has become an iconic landmark visible from miles away.",
    location: {
      address: "San Jose, Tarlac",
      coordinates: {
        lat: 15.4467,
        lng: 120.5456,
      },
    },
    images: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/MONESTERYO/494355964_661781406478530_2229915527239322263_n.jpg",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Monasterio.JPG?height=600&width=800",
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Monasterio%208.JPG?height=600&width=800",

      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Monasterio%203.JPG?height=600&width=800",
    ],
    videos: [
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/Monesterio%20de%20Tarlac.mp4",
    ],
    modelUrl:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/MONESTERYO/tripo_pbr_model_d5f3f79d-2ff9-4b86-8346-de42d01d2ee3.glb",
    qrCode: "/qr-codes/monasterio.png",
    audioDescription:
      "https://btmcdhltlvydssuebwir.supabase.co/storage/v1/object/public/others/heritage/MONESTERYO/ElevenLabs_2025-04-25T06_58_32_Mark%20-%20Natural%20Conversations_pvc_sp100_s50_sb75_se0_b_m2.mp3",
  },
]

// Additional heritage sites for the map
export const allHeritageSites: HeritageSite[] = [
  ...heritageSites,
  {
    id: "maria-clara-museum",
    name: "Maria Clara Museum",
    shortDescription: "A museum dedicated to the iconic Filipino literary character Maria Clara.",
    fullDescription:
      "The Maria Clara Museum showcases artifacts, costumes, and exhibits related to the character Maria Clara from Jose Rizal's novel Noli Me Tangere. The museum preserves the cultural significance of this character who symbolizes the traditional Filipino woman.",
    history:
      "The museum was established to honor the literary legacy of Jose Rizal and to preserve the cultural representation of Filipino women through the character of Maria Clara. It contains various exhibits that depict the lifestyle, fashion, and social context of the Spanish colonial era in the Philippines.",
    location: {
      address: "Camiling, Tarlac",
      coordinates: {
        lat: 15.6923,
        lng: 120.4122,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "bamban-wwii-museum",
    name: "Bamban WWII Museum",
    shortDescription: "A museum dedicated to preserving the history of World War II in Tarlac.",
    fullDescription:
      "The Bamban WWII Museum houses artifacts, photographs, and documents related to the Japanese occupation and the liberation of Tarlac during World War II. It serves as an educational center for understanding the impact of the war on the local community.",
    history:
      "Established to commemorate the experiences of Tarlac residents during World War II, the museum contains items recovered from battlefields, personal belongings of soldiers, and oral histories from survivors. It highlights the resilience of the Filipino people during one of the most challenging periods in Philippine history.",
    location: {
      address: "Bamban, Tarlac",
      coordinates: {
        lat: 15.4042,
        lng: 120.5695,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "tarlac-provincial-capitol",
    name: "Tarlac Provincial Capitol Building",
    shortDescription: "The seat of the provincial government of Tarlac.",
    fullDescription:
      "The Tarlac Provincial Capitol Building is an impressive structure that houses the offices of the provincial government. Its architecture reflects a blend of colonial and modern influences, making it a significant landmark in Tarlac City.",
    history:
      "Constructed during the American colonial period, the Capitol Building has witnessed the political evolution of Tarlac province. It has been renovated and expanded over the years while maintaining its historical significance as the center of provincial governance.",
    location: {
      address: "Provincial Capitol Building, Tarlac City, Tarlac",
      coordinates: {
        lat: 15.4878,
        lng: 120.5932,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "st-michael-parish",
    name: "St. Michael the Archangel Parish",
    shortDescription: "A historic church in Camiling, Tarlac with significant architectural and cultural value.",
    fullDescription:
      "St. Michael the Archangel Parish is one of the oldest churches in Tarlac, featuring Spanish colonial architecture and religious artifacts. The church continues to serve as a spiritual center for the local community.",
    history:
      "Built during the Spanish colonial period, the church has survived wars, natural disasters, and the passage of time. Its bell tower and facade showcase the architectural style prevalent during the Spanish era, making it a valuable heritage site.",
    location: {
      address: "Camiling, Tarlac",
      coordinates: {
        lat: 15.6919,
        lng: 120.4125,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "francisco-macabulos-monument",
    name: "Francisco Macabulos Monument",
    shortDescription: "A monument honoring General Francisco Macabulos, a revolutionary leader from Tarlac.",
    fullDescription:
      "The Francisco Macabulos Monument commemorates the life and contributions of General Francisco Macabulos, who led the revolutionary movement in Central Luzon during the Philippine Revolution against Spanish colonization.",
    history:
      "General Francisco Macabulos was a key figure in the Philippine Revolution, establishing the Central Executive Committee that governed Central Luzon during the revolutionary period. This monument was erected to honor his patriotism and leadership in the struggle for Philippine independence.",
    location: {
      address: "Burgos, La Paz, Tarlac",
      coordinates: {
        lat: 15.4389,
        lng: 120.7289,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "aquino-center-museum",
    name: "Aquino Center and Museum",
    shortDescription: "A museum dedicated to the lives and legacies of Benigno and Corazon Aquino.",
    fullDescription:
      "The Aquino Center and Museum houses memorabilia, photographs, and personal belongings of Senator Benigno 'Ninoy' Aquino Jr. and President Corazon Aquino. It serves as an educational institution that preserves the couple's contributions to Philippine democracy.",
    history:
      "Established after the death of President Corazon Aquino, the museum chronicles the political journey of the Aquino couple, from Ninoy's opposition to the Marcos dictatorship to Cory's presidency that restored democracy in the Philippines. It stands as a testament to their sacrifice and service to the Filipino people.",
    location: {
      address: "Luisita Access Rd, Tarlac City, Tarlac",
      coordinates: {
        lat: 15.4956,
        lng: 120.5978,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "museo-de-tarlac",
    name: "Museo de Tarlac",
    shortDescription: "The provincial museum showcasing Tarlac's cultural heritage and history.",
    fullDescription:
      "Museo de Tarlac is the official provincial museum that houses artifacts, artworks, and exhibits related to Tarlac's cultural heritage, indigenous peoples, and historical events. It serves as a repository of the province's collective memory and identity.",
    history:
      "Established to preserve and promote Tarlac's rich cultural heritage, the museum contains archaeological findings, ethnographic materials from indigenous communities, and historical artifacts from various periods. It plays a vital role in educating the public about Tarlac's contribution to Philippine history and culture.",
    location: {
      address: "Romulo Blvd, Tarlac City, Tarlac",
      coordinates: {
        lat: 15.4867,
        lng: 120.5912,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "hacienda-luisita-train",
    name: "Hacienda Luisita Train Relic",
    shortDescription: "A historical train relic from the sugar plantation era in Tarlac.",
    fullDescription:
      "The Hacienda Luisita Train Relic is a preserved steam locomotive that once transported sugarcane across the vast Hacienda Luisita. It stands as a reminder of Tarlac's agricultural history and the sugar industry that shaped the province's economy.",
    history:
      "The train was part of the transportation network within Hacienda Luisita, one of the largest sugar plantations in the Philippines. It operated during the height of the sugar industry in Tarlac and has been preserved as a historical artifact representing the province's agricultural heritage.",
    location: {
      address: "Luisita, Tarlac City, Tarlac",
      coordinates: {
        lat: 15.5023,
        lng: 120.6012,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "camp-odonnell",
    name: "Camp O'Donnell",
    shortDescription:
      "A former concentration camp that held Filipino and American prisoners of war during World War II.",
    fullDescription:
      "Camp O'Donnell served as a concentration camp where Filipino and American prisoners of war were held after the Bataan Death March during World War II. Today, it stands as a solemn reminder of the atrocities of war and the resilience of those who suffered.",
    history:
      "During the Japanese occupation, Camp O'Donnell became the final destination of the Bataan Death March, where thousands of prisoners died due to disease, malnutrition, and mistreatment. After the war, it was converted into a Philippine Army base, but its historical significance as a site of wartime suffering remains.",
    location: {
      address: "Capas, Tarlac",
      coordinates: {
        lat: 15.3325,
        lng: 120.5878,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "ninoy-aquino-monument",
    name: "Ninoy Aquino Monument",
    shortDescription: "A monument honoring Senator Benigno 'Ninoy' Aquino Jr. in his hometown.",
    fullDescription:
      "The Ninoy Aquino Monument in Concepcion, Tarlac stands as a tribute to Senator Benigno 'Ninoy' Aquino Jr., who was assassinated in 1983. The monument symbolizes his sacrifice for Philippine democracy and his enduring legacy in the country's political history.",
    history:
      "Erected in honor of Tarlac's most famous son, the monument commemorates Ninoy Aquino's opposition to the Marcos dictatorship and his ultimate sacrifice that catalyzed the People Power Revolution. It serves as a reminder of the values of freedom, democracy, and patriotism that he championed.",
    location: {
      address: "Concepcion, Tarlac",
      coordinates: {
        lat: 15.3269,
        lng: 120.657,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "tarlac-state-university",
    name: "Tarlac State University",
    shortDescription: "A historic educational institution that has contributed to Tarlac's development.",
    fullDescription:
      "Tarlac State University is one of the premier educational institutions in Central Luzon, offering various academic programs and contributing to the intellectual and cultural development of the province. Its campus features historic buildings that reflect its long-standing presence in Tarlac.",
    history:
      "Established in 1906 as Tarlac Trade School, the institution evolved through the years, becoming Tarlac College of Technology in 1965 and finally Tarlac State University in 1989. Its growth mirrors the educational development of the province and its commitment to providing quality education to Tarlaqueños.",
    location: {
      address: "Romulo Blvd, Tarlac City, Tarlac",
      coordinates: {
        lat: 15.487,
        lng: 120.5925,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "sanctuario-dela-merced",
    name: "Sanctuario de Nuestra Señora dela Merced",
    shortDescription: "A church dedicated to Our Lady of Mercy with significant religious and cultural importance.",
    fullDescription:
      "The Sanctuario de Nuestra Señora dela Merced is a church that serves as a spiritual center for devotees of Our Lady of Mercy. Its architecture and religious artifacts make it a significant cultural and religious heritage site in Tarlac City.",
    history:
      "The church has a long history of religious devotion and has been a witness to the spiritual life of Tarlaqueños. It houses religious images and artifacts that reflect the deep Catholic faith that has been part of Tarlac's cultural identity since the Spanish colonial period.",
    location: {
      address: "Tarlac City, Tarlac",
      coordinates: {
        lat: 15.4892,
        lng: 120.5967,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "immaculate-conception-church",
    name: "Immaculate Conception Parish Church",
    shortDescription: "A historic church in Concepcion, Tarlac with architectural and religious significance.",
    fullDescription:
      "The Immaculate Conception Parish Church in Concepcion, Tarlac is a historic religious structure that showcases Spanish colonial architecture. It serves as the spiritual center for the local Catholic community and houses religious artifacts and images of cultural and historical value.",
    history:
      "Built during the Spanish colonial period, the church has been a witness to the religious and social life of Concepcion. It has undergone renovations over the years while preserving its historical features. The church played a role in the spread of Catholicism in the region and continues to be an important religious institution in Tarlac.",
    location: {
      address: "Concepcion, Tarlac",
      coordinates: {
        lat: 15.3265,
        lng: 120.656,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "lubigan-eco-tourism-park",
    name: "Lubigan Eco-Tourism Park",
    shortDescription: "A natural park offering eco-tourism activities and showcasing Tarlac's natural heritage.",
    fullDescription:
      "Lubigan Eco-Tourism Park is a natural attraction that offers visitors a chance to experience Tarlac's biodiversity and natural beauty. The park features hiking trails, waterfalls, and various flora and fauna that represent the province's ecological heritage.",
    history:
      "Developed as part of Tarlac's eco-tourism initiative, the park aims to preserve the natural environment while providing recreational opportunities for visitors. It represents the province's commitment to sustainable development and environmental conservation.",
    location: {
      address: "San Jose, Tarlac",
      coordinates: {
        lat: 15.445,
        lng: 120.543,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: "view-deck-sitio-baag",
    name: "View Deck At Sitio Baag",
    shortDescription: "A scenic viewpoint offering panoramic views of Tarlac's landscapes.",
    fullDescription:
      "The View Deck at Sitio Baag provides visitors with breathtaking panoramic views of Tarlac's mountains, valleys, and rural landscapes. It serves as a popular spot for nature lovers, photographers, and tourists seeking to appreciate the natural beauty of the province.",
    history:
      "Developed as a tourist attraction to showcase Tarlac's natural landscapes, the view deck has become a symbol of the province's potential for eco-tourism. It represents the harmonious relationship between the people of Tarlac and their natural environment.",
    location: {
      address: "San Jose, Tarlac",
      coordinates: {
        lat: 15.447,
        lng: 120.544,
      },
    },
    images: ["/placeholder.svg?height=600&width=800"],
  },
]

export const getFeaturedSites = () => {
  return heritageSites.slice(0, 3)
}

export const getSiteById = (id: string) => {
  return allHeritageSites.find((site) => site.id === id) || heritageSites.find((site) => site.id === id)
}

export function getAllSiteIds(): string[] {
  return heritageSites.map((site) => site.id)
}
