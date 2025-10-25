export const groceriesData = [
  { name: 'Srbija', type: 'country', parent: null },
  { name: 'Vojvodina', type: 'region', parent: 'Srbija' },
  { name: 'Beograd', type: 'region', parent: 'Srbija' },

  { name: 'Severno Bački Okrug', type: 'region', parent: 'Vojvodina' },
  { name: 'Subotica', type: 'city', parent: 'Severno Bački Okrug' },
  { name: 'Radnja 1', type: 'store', parent: 'Subotica' },
  { name: 'Radnja 2', type: 'store', parent: 'Subotica' },

  { name: 'Novi Beograd', type: 'city', parent: 'Beograd' },
  { name: 'Bežanija', type: 'city', parent: 'Novi Beograd' },
  { name: 'Radnja 6', type: 'store', parent: 'Bežanija' },
];
