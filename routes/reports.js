const express = require('express');
const router = express.Router();
const Report = require('../models/report');

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getReport, (req, res) => {
  res.json(res.report);
})

router.post('/', async (req, res) => {
  try {
    const report = new Report({
        reportByUserId: "TODO: read user id from session",
        items: req.body.items,
        locationDescription: req.body.locationDescription,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        notes: req.body.notes,
      });
    const newreport = await Report.save();
    res.status(201).json(newreport);
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

module.exports = router