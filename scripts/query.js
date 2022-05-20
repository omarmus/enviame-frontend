// JSON 
let values = {
  1: {
    carrier: 'CCH',
    service: 'DEX'
  },
  2: {
    carrier: 'CCH',
    service: 'express'
  },
  3: {
    carrier: 'CCH',
    service: 'priority'
  },
  15: {
    carrier: 'CHP',
    service: 'nextday'
  },
  16: {
    carrier: 'CHP',
    service: 'sameday'
  },
  17: {
    carrier: 'CHP',
    service: 'express'
  }
}

// JSON
let json = {
  data: {
    BUIN: [
      {
        limit: 1,
        over_carrier_service_id: 17,
        under_carrier_service_id: 17
      },
      {
        limit: 2,
        over_carrier_service_id: 15,
        under_carrier_service_id: 15
      }
    ],
    LAJA: [
      {
        limit: 2,
        over_carrier_service_id: 1,
        under_carrier_service_id: 1
      }, {
        limit: 5,
        over_carrier_service_id: 2,
        under_carrier_service_id: 2
      }, {
        limit: 1,
        over_carrier_service_id: 17,
        under_carrier_service_id: 17
      }
    ],
    LEBU: [
      {
        limit: 2,
        over_carrier_service_id: 1,
        under_carrier_service_id: 1
      }, {
        limit: 6,
        over_carrier_service_id: 3,
        under_carrier_service_id: 3
      }, {
        limit: 5,
        over_carrier_service_id: 2,
        under_carrier_service_id: 2
      }, {
        limit: 4,
        over_carrier_service_id: 16,
        under_carrier_service_id: 16
      }
    ],
    LOTA: [
      {
        limit: 2,
        over_carrier_service_id: 15,
        under_carrier_service_id: 15
      }, {
        limit: 4,
        over_carrier_service_id: 16,
        under_carrier_service_id: 16
      }, {
        limit: 1,
        over_carrier_service_id: 17,
        under_carrier_service_id: 17
      }
    ]
  }
}

const Query = (() => {
  return {
    join (data, values) {
      const result = {}
      for (const key in data) {
        result[key] = data[key].map(item => ({
          limit: item.limit,
          over: values[item.over_carrier_service_id],
          under: values[item.under_carrier_service_id]
        }))
      }
      return result
    },
    maxLimit (data) {
      const result = {}
      for (const key in data) {
        result[key] = data[key].reduce((prev, current) => (prev.limit > current.limit ? prev : current))
      }
      return result
    },
    maxService (data) {
      const [key] = Object.entries(data)
        .reduce(([prevKey, prevValue], [key, value]) => (prevValue.length > value.length ? [prevKey, prevValue] : [key, value]))
      return key
    },
    maxCoberture (data) {
      const totals = {}
      for (const key in data) {
        for (const item of data[key]) {
          if (!totals[item.over_carrier_service_id]) {
            totals[item.over_carrier_service_id] = 0
          }
          if (!totals[item.under_carrier_service_id]) {
            totals[item.under_carrier_service_id] = 0
          }
          totals[item.over_carrier_service_id]++
          totals[item.under_carrier_service_id]++
        }
      }
      const [key] = Object.entries(totals).sort(([key1, value1], [key2, value2]) => value2 - value1)[0]
      return values[key]
    }
  }
})()

const result = Query.join(json.data, values)

console.log('1. Los servicios para cada localidad con mayor limite:')
console.log(Query.maxLimit(result))

console.log('2. La localidad con mayor cantidad de servicios disponibles:')
console.log(Query.maxService(result))

console.log('3. El servicio con mayor cobertura (Usado en más localidades):')
console.log(Query.maxCoberture(json.data))
