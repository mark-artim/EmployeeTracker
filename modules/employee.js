// empTest1 => console.log("employee.js empTest1 was called");
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');


function empTest1() {
    const aa = "employee.js empTest1 was called";
    return aa
}


empTest12 => console.log("employee.js empTest2 was called");
function empTest2() {
    const bb = "employee.js empTest2 was called";
    return bb
}

connectionEmp();

async function connectionEmp() {
    try {
        const connect = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'Gramshammer856!',
            database: 'emptracker_db',
          });

        const listAllRoles = await connect.query('SELECT * FROM role');
        const testRoles = await connect.query('SELECT JSON_ARRAYAGG(title) AS "roles" FROM role');
        var testRoles2 = Object.values(JSON.parse(JSON.stringify(testRoles)));
        var roleChoices = testRoles2[0].roles;
        
        function addEmployee2() {
            inquirer.prompt(addEmpPrompts)
            .then((response) => {
                const addEmp = connect.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',[response.firstName, response.lastName, response.roleId, response.managerId]);
                console.log('New employee record added.');
                return 'New employee record added.'
                mainMenu(); 
            });                      
        };

        // ADD EMPLOYEE INQUIRER
        // const roleChoices = ["1","2","3"];
        const managerChoices = ["1","2 - Dont pick me!"];
        const addEmpPrompts = [
            {
                name: 'firstName',
                type: 'input',
                message: 'New employee first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'New employee last name?'
            },
            {
                name: 'roleId',
                type: 'list',
                message: 'New employee Role?',
                choices: roleChoices
            },
            {
                name: 'managerId',
                type: 'list',
                message: 'New employee Manager?',
                choices: managerChoices
            },
        ] 
        addEmployee2();

        // mainMenu()
    }
    catch(ex) {
        console.log(ex)
    }
}

module.exports.empTest1 = empTest1;
module.exports.empTest2 = empTest2;
module.exports.connectionEmp = connectionEmp;