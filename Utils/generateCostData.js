module.exports.getDefaultCostEstimation2to3Axle = () => {
    return {
        truckType: '2-3 Axle',
        labourCost: {
            driver: {
                salary: 22000,
                foodPerDay: 1500,
                quantity: 1,
                total: 67000
            },
            assistant: {
                salary: 17000,
                foodPerDay: 1500,
                quantity: 1,
                total: 62000
            },
            totalDistanceTravelledPerMonth: 9600,
            labourCostPerKm: 13.44
        },
        fuelCost: {
            totalDistance: 2400,
            totalFuel: 500,
            mileage: 4.8,
            fuelCostPerLitre: 286,
            fuelCostPerKm: 59.58
        },
        routineMaintenanceCost: {
            oilChange: {
                litres: 10,
                unitCost: 1500,
                total: 15000
            },
            filtersChange: {
                unitCost: 5000,
                quantity: 1,
                total: 5000
            },
            vehicleService: {
                unitCost: 3000,
                quantity: 1,
                total: 3000
            },
            airCheck: {
                unitCost: 50,
                quantity: 6,
                total: 300
            },
            routineMaintenanceWorkDoneAfterKms: 2400
        },
        tireCost: {
            tireCost: 30000,
            averageLifeOfTiresKms: 30000,
            tireCostPerKm: 10.00
        },
        repairCostPerKm: {
            averageRepairCost: 70000,
            numberOfKilometers: 9600,
            averageRepairCostPerKm: 7.29
        },
        miscellaneousCostPerKm: {
            tollTaxes: 17000,
            policeCost: 10000,
            miscCostPerKm: 11.25
        },
        summary: {
            labourCost: 13.44,
            fuelCost: 59.58,
            routineMaintenanceCost: 9.71,
            tireCostPerKm: 10.00,
            repairCostPerKm: 7.29,
            miscCostPerKm: 11.25,
            vocPerKm: 111.27
        }
    };
}

module.exports.getDefaultCostEstimation4to5Axle = () => {
    return {
        truckType: '4-5 Axle',
        labourCost: {
            driver: {
                salary: 25000,
                foodPerDay: 1500,
                quantity: 1,
                total: 70000
            },
            assistant: {
                salary: 17500,
                foodPerDay: 1500,
                quantity: 2,
                total: 107500
            },
            totalDistanceTravelledPerMonth: 9600,
            labourCostPerKm: 18.49
        },
        fuelCost: {
            totalDistance: 2400,
            totalFuel: 610,
            mileage: 3.93,
            fuelCostPerLitre: 286,
            fuelCostPerKm: 72.69
        },
        routineMaintenanceCost: {
            oilChange: {
                litres: 16,
                unitCost: 1500,
                total: 24000
            },
            filtersChange: {
                unitCost: 5000,
                quantity: 1,
                total: 5000
            },
            vehicleService: {
                unitCost: 3000,
                quantity: 1,
                total: 3000
            },
            airCheck: {
                unitCost: 50,
                quantity: 10,
                total: 500
            },
            routineMaintenanceWorkDoneAfterKms: 2400
        },
        tireCost: {
            tireCost: 50000,
            averageLifeOfTiresKms: 30000,
            tireCostPerKm: 16.67
        },
        repairCostPerKm: {
            averageRepairCost: 80000,
            numberOfKilometers: 9600,
            averageRepairCostPerKm: 8.33
        },
        miscellaneousCostPerKm: {
            tollTaxes: 20000,
            policeCost: 13000,
            miscCostPerKm: 13.75
        },
        summary: {
            labourCost: 18.49,
            fuelCost: 72.69,
            routineMaintenanceCost: 13.54,
            tireCostPerKm: 16.67,
            repairCostPerKm: 8.33,
            miscCostPerKm: 13.75,
            vocPerKm: 143.47
        }
    };
}

module.exports.getDefaultCostEstimation6Axle = () => {
    return {
      truckType: '6 Axle',
      labourCost: {
        driver: {
          salary: 25000,
          foodPerDay: 1500,
          quantity: 1,
          total: 70000
        },
        assistant: {
          salary: 17500,
          foodPerDay: 1500,
          quantity: 2,
          total: 107500
        },
        totalDistanceTravelledPerMonth: 9600,
        labourCostPerKm: 18.49
      },
      fuelCost: {
        totalDistance: 2400,
        totalFuel: 1000,
        mileage: 2,
        fuelCostPerLitre: 286,
        fuelCostPerKm: 118.98
      },
      routineMaintenanceCost: {
        oilChange: {
          litres: 18,
          unitCost: 1500,
          total: 27000
        },
        filtersChange: {
          unitCost: 6000,
          quantity: 1,
          total: 6000
        },
        vehicleService: {
          unitCost: 4000,
          quantity: 1,
          total: 4000
        },
        airCheck: {
          unitCost: 50,
          quantity: 14,
          total: 700
        },
        routineMaintenanceWorkDoneAfterKms: 2400
      },
      tireCost: {
        tireCost: 50000,
        averageLifeOfTiresKms: 30000,
        tireCostPerKm: 36.67
      },
      repairCostPerKm: {
        averageRepairCost: 80000,
        numberOfKilometers: 9600,
        averageRepairCostPerKm: 8.33
      },
      miscellaneousCostPerKm: {
        tollTaxes: 20000,
        policeCost: 15000,
        miscCostPerKm: 14.58
      },
      summary: {
        labourCost: 18,
        fuelCost: 119,
        routineMaintenanceCost: 16,
        tireCostPerKm: 37,
        repairCostPerKm: 8,
        miscCostPerKm: 15,
        vocPerKm: 212.76
      }
    };
  }
  
