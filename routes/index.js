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
    request.get("http://**/testrail/index.php?/api/v2/get_cases/1" + "&suite_id=" + suite_id)
    .auth("*", "*")
    .type("json")
    .end(function(cases_err, cases_res) {
        if (cases_err) {
            res.send(case_err.message);
        }
        //console.log(cases_res.body);
        var case_ids = cases_res.body;
        case_ids.forEach(function(e, i, o) {
            var case_id = e.id;
            console.log(case_id);
            request.get("http://**/testrail/index.php?/api/v2/get_case/" + case_id)
            .auth("*", "*")
            .type("json")
            .end(function(case_err, case_res) {
                console.log(case_res.text);
                if (cases_err) {
                    res.send(cases_err.message);
                } else {
                    results.push(case_res.text);
                }
            });
        });

        res.send(results);
    });
});

module.exports = router;