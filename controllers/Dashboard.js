const { fn, col } = require("sequelize")
const ImportedItems = require("../models/ImportedItem")
const Stores = require("../models/Store")
const Users = require("../models/User")
const DamagedItems = require("../models/DamagedItem")
const { sequelize } = require("../config/config")

const dashboardCard = async (_, response) => {

    // count the total of following (Users,Stores,Total Items,Total Damaged Items)
    // {
    //     users:100,
    //     stores:3,
    //     items:100,
    //     damagedItems:30
    // }

    const totalUsers = await Users.count()
    const totalStores = await Stores.count()

    const itmRes = await ImportedItems.findAll({
        attributes: [
            [fn("SUM", col("qoh")), "qoh"],      // sum of qoh
        ],
        raw: true,
    });
    const dmgRes = await DamagedItems.findAll({
        attributes: [
            [fn("SUM", col("quantity")), "qty"],      // sum of qoh
        ],
        raw: true,
    });


    response.status(200).json({
        success: true,
        message: "Fetched Dashboard Cards successfully",
        data: {
            users: totalUsers ?? 0,
            stores: totalStores ?? 0,
            items: itmRes[0]?.qoh ?? 0,
            damagedItems: dmgRes[0]?.qty ?? 0
        }
    })
}

const topInventories = async (_, response) => {
    const [topItems] = await sequelize.query(`
        SELECT item_name AS "name",store_name AS "store",qoh as "qoh",
        (imported_items.QOH + SUM(QUANTITY)) AS "importedQuantity"
        ,sum(quantity) as "exportedQuantity"

        FROM imported_items JOIN new_items 	ON

	    imported_items.new_item_id=new_items.id
    
    join stores ON
     imported_items.store_id = stores.id 
    join exported_items ON
     exported_items.new_item_id = imported_items.new_item_id AND exported_items.store_id = imported_items.store_id
     
     GROUP BY exported_items.new_item_id ,exported_items.store_id
     ORDER BY imported_items.qoh DESC
     limit 5;
        `)

    response.status(200).json({
        success: true,
        message: "Fetched Summary Info successfully",
        data: topItems
    })
}

module.exports = { dashboardCard, topInventories }