const express = require('express');
const router = express.Router();
const Report = require('../models/report');

router.get('/', async (req, res) => {
  try {
    var filter = {};
    const dateFilter = req.query.dateFilter;
    if (dateFilter) {
      if (dateFilter === '24h') {
        filter.createdOn = {
            $gte: new Date(new Date().setDate(new Date().getDate()-1))
        };
      } else {
        return res.status(400).json({ message: 'Unrecognized dateFilter: ' + dateFilter });
      }
    }
    console.log('report filter: ');
    console.log(filter);
    res.json(await Report.find(filter));
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getReport, (req, res) => {
  res.json(res.report);
});

router.post('/', async (req, res) => {
  try {
    const report = new Report({
        reportByUserId: req.user._id,
        items: req.body.items,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        notes: req.body.notes,
      });
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getReport, async (req, res) => {
  try {
    await res.report.remove();
    res.json({ message: 'Deleted report' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getReport(req, res, next) {
  let report
  try {
    report = await Report.findById(req.params.id);
    if (report == null) {
      return res.status(404).json({ message: 'Cannot find report' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.report = report;
  next();
}

module.exports = router;