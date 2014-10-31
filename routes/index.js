var express = require('express');
var router = express.Router();
var request = require('superagent');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Monorail'
    });
});

router.post("/submit", function(req, res) {
    var results = [];
    var suite_id = req.body.suite_id;
    request.get("http://url/testrail/index.php?/api/v2/get_cases/1" + "&suite_id=" + suite_id)
    .auth("user", "pass")
    .type("json")
    .end(function(cases_err, cases_res) {
        if (cases_err) {
            res.send(case_err.message);
        }
        var case_ids = cases_res.body;
        case_ids.forEach(function(e, i, o) {
            var case_id = e.id;
            request.get("http://url/testrail/index.php?/api/v2/get_case/" + case_id)
            .auth("user", "pass")
            .type("json")
            .end(function(case_err, case_res) {
                if (cases_err) {
                    res.send(cases_err.message);
                } else {
                    results.push(case_res.text);
                    if (results.length == case_ids.length) res.send(results);
                }
            });
        });
    });
});

module.exports = router;