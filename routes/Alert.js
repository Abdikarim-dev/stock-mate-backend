const express = require("express");
const Alerts = require("../models/Alert");
const ImportedItems = require("../models/ImportedItem");
const router = express.Router();


router.get("/summary", async (_, response) => {

    const items = await ImportedItems.findAll({ include: ["newItem", "store"] })
    const alerts = await Alerts.findAll()

    const itemsLessThan30 = items.filter(item => item.qoh < 30)
    const itemsGreaterThanOrEqual30 = items.filter(item => item.qoh >= 30)

    // Less than 30
    for (const item of itemsLessThan30) {
        const existingItem = alerts.find(alert => alert.item_id === item.new_item_id && alert.store_id === item.store_id)
        // Creating an Alert
        if (!existingItem) {
            await Alerts.create({
                item_id: item.new_item_id,
                store_id: item.store_id,
                qoh: item.qoh,
                title: "Item Alert",
                description: `Warning: The quantity of ${item.newItem.item_name} in ${item.store.store_name} Store is low. 
                  Only ${item.qoh} left.`,
            })
        }
        else if (existingItem && existingItem.qoh !== item.qoh) {
            await Alerts.update(
                {
                    qoh: item.qoh,
                    description: `Warning: The quantity of ${item.newItem.item_name} in ${item.store.store_name} Store is low. 
                  Only ${item.qoh} left.`,
                }
                , { where: { id: existingItem.id } }
            )
        }
    }

    // Greater than 30
    for (const item of itemsGreaterThanOrEqual30) {
        const existingItem = alerts.find(alert => alert.item_id === item.new_item_id && alert.store_id === item.store_id)

        if (existingItem) {
            await Alerts.destroy({
                where: {
                    item_id: item.new_item_id,
                    store_id: item.store_id
                }
            })
        }
    }

    // get the updated alerts 
    const createdAlerts = await Alerts.findAll()

    response.status(200).json({
        success: true,
        message: "Summary Synced successfully",
        alerts: createdAlerts
    });
})


module.exports = router;