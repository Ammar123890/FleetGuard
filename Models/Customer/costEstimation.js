const mongoose = require('mongoose');

const truckCostEstimationSchema = new mongoose.Schema({
  truckType: {
    type: String,
    required: true
  },
  labourCost: {
    driver: {
      salary: Number,
      foodPerDay: Number,
      quantity: Number,
      total: Number
    },
    assistant: {
      salary: Number,
      foodPerDay: Number,
      quantity: Number,
      total: Number
    },
    totalDistanceTravelledPerMonth: Number,
    labourCostPerKm: Number
  },
  fuelCost: {
    totalDistance: Number,
    totalFuel: Number,
    mileage: Number,
    fuelCostPerLitre: Number,
    fuelCostPerKm: Number
  },
  routineMaintenanceCost: {
    oilChange: {
      litres: Number,
      unitCost: Number,
      total: Number
    },
    filtersChange: {
      unitCost: Number,
      quantity: Number,
      total: Number
    },
    vehicleService: {
      unitCost: Number,
      quantity: Number,
      total: Number
    },
    airCheck: {
      unitCost: Number,
      quantity: Number,
      total: Number
    },
    routineMaintenanceWorkDoneAfterKms: Number
  },
  tireCost: {
    tireCost: Number,
    averageLifeOfTiresKms: Number,
    tireCostPerKm: Number
  },
  repairCostPerKm: {
    averageRepairCost: Number,
    numberOfKilometers: Number,
    averageRepairCostPerKm: Number
  },
  miscellaneousCostPerKm: {
    tollTaxes: Number,
    policeCost: Number,
    miscCostPerKm: Number
  },
  summary: {
    labourCost: Number,
    fuelCost: Number,
    routineMaintenanceCost: Number,
    tireCostPerKm: Number,
    repairCostPerKm: Number,
    miscCostPerKm: Number,
    vocPerKm: Number
  }
});

const TruckCostEstimation = mongoose.model('TruckCostEstimation', truckCostEstimationSchema);

module.exports = TruckCostEstimation;
