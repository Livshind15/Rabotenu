export const optionsSearch = [
    { title: 'חיפוש מדוייק', description: "חיפוש מדוייק של מילות החיפוש ללא מרחקים" },
    { title: 'חיפוש קל', description: "חיפוש מדוייק של מילות החיפוש עם מרחקים ביניהם" },
    { title: 'חפש תוצאות קרובות', description: "חפש עם קידומות לכל המילים,כתיב חסר למילים בכתיב מלא, מרחק של עד 30 מילים בין מילה למילה" },
     { title: 'חפש תוצאות דומות', description: "חפש חיפוש עמום עד 20 אחוז,דלג על מילים עד 40 אחוז" },
    { title: 'חיפוש טבלאי', description: "פתח את החיפוש הטבלאי" },
  
  ]
  export const  searchTypes = ["חיפוש מדוייק", "חיפוש קל", "חפש תוצאות קרובות", "חפש תוצאות דומות"]

  
  export const typeToIndex = ['exact', 'closeWords', 'wordForms',"likeSearch", 'table'];