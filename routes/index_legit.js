var express = require('express');
var router = express.Router();
var request = require('superagent');

/* GET home page */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Monorail'
    });
});

router.post('/submit', function (req, res, next) {
    var results = [];
    var suite_id = req.body.suite_id;
    request.get('http://192.168.200.38/testrail/index.php?/api/v2/get_cases/1' + "&suite_id=" + suite_id)
    .auth('carrie.omalley@cascadehr.co.uk', 'm8tbsauh')
    .type('json')
    .end(function (cases_err, cases_res) {
        if (cases_err) {
            res.send(cases_err.message);
        }
        var case_ids = cases_res.body;
        case_ids.forEach(function (e, i, o) {
            var case_id = e.id;
            request.get('http://192.168.200.38/testrail/index.php?/api/v2/get_case/' + case_id)
            .auth('carrie.omalley@cascadehr.co.uk', 'm8tbsauh')
            .type('json')
            .end(function (case_err, case_res) {
                if (case_err) {
                    res.send(case_err.message);
                } else {
                    var result = JSON.parse(case_res.text);
                    // console.log(result.custom_steps_separated);
                    if (result.custom_steps_separated === null) {
                        result.custom_steps_separated=[];
                    }
                    results.push(result);
                    if (results.length === case_ids.length) {
                        res.render('submit', {
                            title: 'Scenario S'+ suite_id,
                            results: results.sort(function (a, b) {
                                return a.section_id-b.section_id
                            })
                        });
                    }
                }
            });
        });
    });
});

router.get("/test", function (req, res, next) {
    next({ErrorMessage: 'oh noes'});
})

module.exports = router;