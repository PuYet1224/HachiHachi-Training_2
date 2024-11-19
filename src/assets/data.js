// src/data.js
const data = [
    {
      id: 1,
      name: "Quốc Gia A",
      cities: [
        {
          id: 1,
          name: "Thành Phố A1",
          districts: [
            { id: 1, name: "Quận A1-1" },
            { id: 2, name: "Quận A1-2" },
          ],
        },
        {
          id: 2,
          name: "Thành Phố A2",
          districts: [
            { id: 3, name: "Quận A2-1" },
            { id: 4, name: "Quận A2-2" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Quốc Gia B",
      cities: [
        {
          id: 3,
          name: "Thành Phố B1",
          districts: [
            { id: 5, name: "Quận B1-1" },
            { id: 6, name: "Quận B1-2" },
          ],
        },
        {
          id: 4,
          name: "Thành Phố B2",
          districts: [
            { id: 7, name: "Quận B2-1" },
            { id: 8, name: "Quận B2-2" },
          ],
        },
      ],
    },
  ];
  
  export default data;
  