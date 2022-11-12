const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'trojans',
    database: 'trackem_db'

});
db.connect(function(err){
    if(err)throw err;
    start();
});
function start() {
    inquirer.prompt(
        {
            name: 'option',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees by Manager',
                'View All Employees by Department',
                'Add Employee',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Quit'
            ],
        })
        .then(function (answer) {
            switch (answer.option) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    UpdateRole();
                case 'View All Roles':
                    viewRoles();
                case 'Add Role':
                    addRole();
                case 'View All Departments':
                    viewDepartments();
                case 'Add Department':
                    addDepartment();
                case 'Quit':
                    quit();
                    break;
            }
        })
}
function viewEmployees() {
    db.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}
function addEmployee() {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "What is the employee's first name?",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "What is the employee's last name?",
            },
            {
                name: 'role',
                type: 'list',
                choices: function () {
                    let roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "What is the employee's role?"
            },
        ])
        .then(function(answer){
            let roleId;
            for (let i = 0; i < res.length; i++) {
                if(res[i].title==answer.role){
                roleId=res[i].id;
                console.log(roleId)               
            }
        }
        db.query('INSERT INTO employee SET ?',
        {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: roleId,
        },
        function(err){
            if(err)throw err;
            console.log(`Added ${answer.first_name} ${answer.last_name} to the database`);
            start();
        }
        
        )
        }
        )
    })
}
function UpdateRole(){
    var roleSelection = 'SELECT * FROM role;';
    var deptSelection = 'SELECT * FROM department;';

    db.query(roleSelection, function(err, role){
        if(err) throw err;
        db.query(deptSelection, function(err, department){
            if(err) throw err;
            inquirer.promt([
                {
                    name:'new_role',
                    type: 'rawlist',
                    choices: function(){
                        let roleArray=[];
                        for (let i = 0; i < role.length; i++) {
                            roleArray.push(role[i].title);                     
                        }
                        return roleArray;
                    },
                    message: "Which employee's role do you want to update?",
                    choices: function() {
                        let employeeArray=[];
                        res.
                        
                    }
                }
            ])

        })
    }

}
    
    // function quit(){
    //     db.end();
    // }