const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

async function runShellScript(script) {
    const output = await execPromise(script)
    return output
}

const express = require('express');

const app = express();

app.use(express.urlencoded());

app.get('/', function (request, response, next) {
    response.sendFile('./index.html', { root: __dirname })
});

app.post('/', async function (request, response, next) {
    const { report_name, profile_name, aws_account_id } = request.body

    const step1 = await runShellScript(`sh step1.sh "${report_name}" ${profile_name} ${aws_account_id}`)
    console.log(step1)
    response.write(`<pre>${step1.stdout}</pre>`)

    const step2 = await runShellScript(`sh step2.sh ${report_name} ${profile_name} ${aws_account_id}`)
    console.log(step2)
    response.write(`<pre>${step2.stdout}</pre>`)

    const step3 = await runShellScript(`sh step3.sh ${report_name} ${profile_name} ${aws_account_id}`)
    console.log(step3)
    response.write(`<pre>${step3.stdout}</pre>`)

    response.end()
});

app.listen(2000);
