const mongoose = require('mongoose')
const con = require('../mySql')
const Redis = require('ioredis')
var fs = require('fs')

const Project = mongoose.model('Project')
const Message = mongoose.model('Message')
const Score = mongoose.model('Score')
const User = mongoose.model('User')
const Comment = mongoose.model('Comment')
const History = mongoose.model('History')

exports.getHomepage = (req, res) => {
  res.render('index')
}

exports.userSignout = (req, res) => {
  req.logout()
  res.redirect('/')
}

exports.getDashboard = async (req, res) => {
  console.log('teacher_id : ' + req.user.teacher_id)
  const projects = await Project
    .find({ $and : [
        {status: {$ne : "pending"} },
        {$or: [{ creator: req.user.username }, { collaborator: req.user.username }]}
      ]
    })
    .sort({ createdAt: -1 })
  const invitations =  await Project
    .find({ $and : [
          {status: "pending" },
          {collaborator: req.user.username }
        ]
      })
    .sort({ createdAt: -1 })
  const pendings =  await Project
  .find({ $and : [
        {status: "pending" },
        {creator: req.user.username }
      ]
    })
  .sort({ createdAt: -1 })
  // projects.forEach(element => {
  //   console.log(element)
  //   let partner = ''
  //   if(req.user.username == element.creator) {
  //     partner = await User
  //     .findOne(req.user.username)
  //   } else {
  //     partner = await User
  //     .findOne(req.user.username)
  //   }
  //   element.partner_img = partner.img
  //   console.log(element.partner_img)
  // });
  var occupation;
  if(req.user.info.occupation == 'student') {
    occupation = 0
  } else if(req.user.info.occupation == 'teacher') {
    occupation = 1
  }

  res.render('dashboard', { projects, invitations, pendings, title: 'Dashboard' })
}

exports.getLobby = async (req, res) => {
  const projects = await Project
    .find({ $and : [
        {status: {$ne : "pending"} },
        {$or: [{ creator: req.user.username }, { collaborator: req.user.username }]}
      ]
    })
    .sort({ createdAt: -1 })
  const invitations =  await Project
    .find({ $and : [
          {status: "pending" },
          {collaborator: req.user.username }
        ]
      })
    .sort({ createdAt: -1 })
  const pendings =  await Project
  .find({ $and : [
        {status: "pending" },
        {creator: req.user.username }
      ]
    })
  .sort({ createdAt: -1 })
  var occupation = req.user.info.occupation;
  var querySection = 'SELECT * FROM section WHERE class_code = \'xxxxxxxxx\'';
  var sections = [];
  if(occupation == 'teacher') {
    occupation = 0
    querySection = 'SELECT * FROM section AS s JOIN course AS c ON s.course_id = c.course_id JOIN teacher AS t ON c.teacher_id = t.teacher_id AND t.email = \'' + req.user.email + '\''
    sections = await con.getSection(querySection)
    console.log("occupation : " + occupation + ", teacher : " + req.user.info.occupation)
  } else {
    occupation = 1
    querySection = 'SELECT * FROM course AS c JOIN section AS s ON c.course_id = s.course_id JOIN enrollment AS e ON s.section_id = e.section_id JOIN student AS st ON e.student_id = st.student_id AND st.email = \'' + req.user.email + '\''
    sections = await con.getSection(querySection)
    console.log("occupation : " + occupation + ", student : " + req.user.info.occupation)
  }
  if(!sections.length) sections = []
  res.render('lobby', { projects, invitations, pendings, occupation, sections, title: 'Lobby' })
}

exports.getPlayground = async (req, res) => {
  if (!req.query.pid) res.redirect('/dashboard')
  const user_role = req.query.user_role
  let partner_obj = ''
  const project = await Project.findOne({ pid: req.query.pid })
  const messages = await Message
      .find({ pid: req.query.pid})
      .sort({ createdAt: 1 })
  if ('creator' == user_role){
    partner_obj = await User
    .findOne({ _id: project.collaborator_id})
  } else {
    partner_obj = await User
    .findOne({ _id: project.creator_id})
  }
  res.render('playground', { project, title: `${project.title} - Playground`, messages, partner_obj})
}

exports.getHistory = async (req, res) => {
  const redis = new Redis()
  var code = await redis.hget(`project:${req.query.pid}`, 'editor', (err, ret) => ret)

  const project = await Project
    .findOne({ pid: req.query.pid})
  var creator = project.creator
  var collaborator = project.collaborator
  var curUser = req.query.curUser

  if(curUser==creator){
    var curUser_obj = await User
    .findOne({ username: curUser})
    var partner_obj = await User
      .findOne({ username: collaborator})
  }else{
    var curUser_obj = await User
    .findOne({ username: curUser})
    var partner_obj = await User
      .findOne({ username: creator})
  }

  const histories = await History
    .find({ pid: req.query.pid})
  res.render('history', { histories, code, project, curUser_obj, partner_obj, creator, title: 'History' })
}

exports.getAboutUs = (req, res) => {
  res.render('aboutus')
}

exports.getFeature = (req, res) => {
  res.render('feature')
}

exports.getProfile = async (req, res) => {
  const projects = await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
  res.render('profile', { projects })
}

exports.getNotifications = async (req, res) => {
  const projects = await Project
    .find({ $or: [{ creator: req.user.username }, { collaborator: req.user.username }] })
    .sort({ createdAt: -1 })
  res.render('notifications', { projects , title: 'Notifications'})
}

exports.createProject = async (req, res) => {
  const collaborator = await User
  .findOne({ username: req.body.collaborator})
  if (collaborator != null) {
    const project = await (new Project(req.body)).save()
    Project.update({
      _id: project._id
    }, {
      $set: {
        collaborator_id: collaborator._id
      }
    }, (err) => {
      if (err) throw err
    })
    req.flash('success', `Successfully Created ${project.title} Project.`)
    //create directory
    var dir1 = './public/project_files';
    var dir2 = './public/project_files/'+project.pid;
    if (!fs.existsSync(dir1)){
      fs.mkdirSync(dir1);
    }
    if (!fs.existsSync(dir2)){
      fs.mkdirSync(dir2);
    }
    fs.writeFile('./public/project_files/'+project.pid+'/json.json', JSON.stringify([{ id:'0', type:'code', source:''}]), function (err) {
      if (err) throw err;
      console.log('file '+project.pid+'.json is created');
    });

  } else {
    req.flash('error', "Can't find @" + req.body.collaborator)
  }
  res.redirect('dashboard')
}

exports.createSection = async (req, res) => {
  const queryCourse = 'INSERT INTO course (teacher_id, course_name) VALUES ?';
  const queryTeacher = 'SELECT teacher_id FROM teacher WHERE username = \'' + req.user.username + '\''
  const querySection = 'INSERT INTO section (course_id, section, room, class_code, day, time_start, time_end) VALUES ?';
  const teacher = await con.getTeacher(queryTeacher)
  const teacher_id = teacher[0].teacher_id
  const courseValues = [[teacher_id, req.body.course_name]]
  const course_id = await con.createCourse(queryCourse, courseValues)
  const classCode = await con.isDuplicateClassCode()
  const time_start = req.body.time_start_hh + ':' + req.body.time_start_mm + '' + req.body.time_start_ap
  const time_end = req.body.time_end_hh + ':' + req.body.time_end_mm + '' + req.body.time_end_ap
  const sectionValues = [[course_id, req.body.section, req.body.room, classCode, req.body.day, time_start, time_end]]
  const sections = await con.createSection(querySection, sectionValues)
  res.redirect('lobby')
}

exports.createPairingDateTime = async (req, res) => {
  const queryPairingDateTime = 'INSERT INTO pairing_session (section_id, date_time, status) VALUES ?'
  const querySection = 'SELECT * FROM section AS s WHERE s.section_id = ' + req.body.section_id + '';
  const section = await con.getSection(querySection);
  console.log('section_id : ' + section[0].section_id)
  const date_time = req.body.date_time
  const section_id =
  console.log('date_time : ' + date_time)
  const values = [[section[0].section_id, date_time, 1]]
  const pairing_date_time_id = await con.createPairingDateTime(queryPairingDateTime, values)
  let temp = {}
  temp['pairing_date_time_id'] = pairing_date_time_id
  temp['section_id'] = section[0].section_id
  temp['date_time'] = date_time
  temp['status'] = 1
  res.json(temp).status(200)
}

exports.deleteSection = async (req, res) => {
  const deleteSection = 'DELETE FROM section WHERE section_id = ' + req.body.section_id;
  const status = await con.deleteSection(deleteSection)
  let temp = {}
  temp['status'] = status
  console.log('temp : ' + temp.status + ', ' + req.body.section_id)
  res.json(temp).status(200)
}

exports.updateSection = async (req, res) => {
  const time_start = req.body.time_start_hh + ':' + req.body.time_start_mm + '' + req.body.time_start_ap
  const time_end = req.body.time_end_hh + ':' + req.body.time_end_mm + '' + req.body.time_end_ap
  const queryCourse = 'UPDATE course SET course_name = \'' + req.body.course_name + '\' WHERE course_id = ' + req.body.course_id;
  const querySection = 'UPDATE section SET section = ' + req.body.section + ', room = \'' + req.body.room + '\', day = \'' + req.body.day + '\', time_start = \'' + time_start + '\', time_end = \'' + time_end + '\' WHERE section_id = ' + req.body.section_id;
  var courseStatus = await con.updateCourse(queryCourse);
  var sectionStatus = await con.updateSection(querySection);
  res.redirect('/classroom?section_id=' + req.body.section_id)
}

exports.getSection = async (req, res) => {
  var occupation = req.user.info.occupation;
  var queryStudent = 'SELECT * FROM student AS st JOIN enrollment AS e ON st.student_id = e.student_id AND e.section_id = ' + req.query.section_id + ' ORDER BY st.first_name ASC';
  var querySection = 'SELECT * FROM course AS c JOIN section AS s WHERE c.course_id = s.course_id AND s.section_id = ' + req.query.section_id + '';
  var queryAssignment = 'SELECT * FROM assignment WHERE section_id = ' + req.query.section_id
  var section = [];
  var students = [];
  var assignments = [];
  section = await con.getSection(querySection)
  students = await con.getStudent(queryStudent)
  assignments = await con.getAssignment(queryAssignment)

  if(!section.length) section = []
  else section = section[0]

  if(!students.length) students = []
  if(!assignments.length) assignments = []

  if(occupation == 'teacher') {
    occupation = 0
    var queryPairingDateTime = 'SELECT * FROM pairing_session AS ps WHERE ps.section_id = ' + req.query.section_id + ' ORDER BY ps.pairing_session_id DESC';
    var pairingDateTimes = [];

    pairingDateTimes = await con.getPairingDateTime(queryPairingDateTime)

    const pairingTimes = pairingDateTimes.length
    if(!pairingTimes) {
      pairingDateTimes = [{status: -1}]
    }

    res.render('classroom', { occupation, section, assignments, students, pairingDateTimes, pairingTimes, title: section.course_name })
  } else {
    occupation = 1
    var projects_in_section = []
    var count = 0
    const projects = await Project
      .find({ $and : [
          {status: {$ne : "pending"} },
          {$or: [{ creator: req.user.username }, { collaborator: req.user.username }]}
        ]
      })
      .sort({ createdAt: -1 })
    for (i in assignments) {
      projects.forEach(function(project){
        if(project.assignment_id == assignments[i].assignment_id) {
          projects_in_section[count] = project
          count++;
          console.log(projects_in_section, '-----------TRUE');
        } else {
          // console.log(project.assignment_id, '-----------FALSE');
        }
      });
    }
    pairingDateTimes = [{status: -1}]

    res.render('classroom', { occupation, section, assignments, students, projects_in_section, pairingDateTimes, title: section.course_name })
  }
}

exports.removeStudent = async (req, res) => {
  console.log('student_id : ' + req.body.enrollment_id)
  var removeStudent = 'DELETE FROM enrollment WHERE enrollment_id = ' + req.body.enrollment_id;
  var status = await con.removeStudent(removeStudent);
  let temp = {}
  temp['status'] = status
  console.log('temp : ' + temp + ', ' + status)
  res.json(temp).status(200)
}

exports.joinClass = async (req, res) => {
  var querySection = 'SELECT * FROM section WHERE class_code = \'' + req.body.class_code + '\''
  var queryStudent = 'SELECT * FROM student WHERE username = \'' + req.user.username + '\''
  var section = await con.getSection(querySection).then(function(res) {
    console.log('section : ' + res[0])
    return res
  })
  var student = await con.getStudent(queryStudent).then(function(res) {
    console.log('student : ' + res[0])
    return res
  })
  if(section.length) {
    var queryEnrollment = 'INSERT INTO enrollment (student_id, section_id, grade) VALUES ?'
    var values = [[student[0].student_id, section[0].section_id, '4']]
    var status = await con.postEnrollment(queryEnrollment, values)
  }
  res.redirect('/lobby')
}

exports.editProject = async (req, res) => {
  const id = req.body.pid
  Project.update({
      pid: id
    }, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        swaptime: req.body.swaptime
      }
    }, function(err, result){
      if(err) throw err
    })
  res.redirect('/dashboard')
}

exports.deleteProject = async (req, res) => {
  const id = req.body.id
  Score.remove({
    pid: id
    },  function(err, result){
      if(err) throw err
  })
  Project.remove({
      pid: id
    },  function(err, result){
      if(err) throw err
    })
  Message.remove({
      pid: id
    }, function(err, result){
      if(err) throw err
    })
  Comment.remove({
      pid: id
    }, function(err, result){
      if(err) throw err
      res.end()
    })
}

exports.searchUser = async (req, res) => {
  const keyword = req.query.search
  console.log(req.query.search)
  const users = await User.find( {
    username: {$regex: '.*' + keyword + '.*'}
  })
  res.send(users)
}

exports.updatePairingDateTimeStatus = async (req, res) => {
  //console.log('status : ' + req.body.status + ', pairing_id : ' + req.body.pairing_date_time_id + ', partner_keys : ', partner_keys)

  //create date time at this moment
  var time_end = new Date()
  var str_time_end = time_end.toString()
  var split_time_end = str_time_end.split(' ')
  var slice_time_end = split_time_end.slice(0, 5)
  time_end = slice_time_end.join(' ')

  const status = req.body.status
  const pairing_date_time_id = req.body.pairing_date_time_id
  const updatePairingDateTimeStatus = 'UPDATE pairing_session SET status = ' + status + ', time_end = \'' + time_end + '\' WHERE pairing_session_id = ' + pairing_date_time_id;
  var res_status = await con.updatePairingDateTime(updatePairingDateTimeStatus)
  if(res_status == 'Update completed.') {
    console.log(req.body.section_id)
    const resetPartner = 'UPDATE enrollment SET partner_id = NULL WHERE section_id = ' + req.body.section_id
    res_status = await con.updateEnrollment(resetPartner)
    console.log(2)
  } else {
    res_status = 'Update a pairing date time status failed.'
  }
  console.log('res_status : ' + res_status)
  res.send({status: res_status, time_end: time_end})
}

exports.getPairingDateTime = async (req, res) => {
  const queryPairingDateTime = 'SELECT * FROM pairing_session WHERE section_id = ' + req.query.section_id
  const pairingDateTime = await con.getPairingDateTime(queryPairingDateTime)
  const pairingTime = pairingDateTime.length
  res.send({pairingTime: pairingTime})
}

exports.resetPair = async (req, res) => {
  const updateEnrollment = 'UPDATE enrollment SET partner_id = ' + req.body.partner_id + ' WHERE section_id = ' + req.body.section_id
  const res_status = await con.updateEnrollment(updateEnrollment)
  res.send({status: res_status})
}

exports.searchUserByPurpose = async (req, res) => {
  const purpose = req.query.purpose
  const uid = req.query.uid
  const score = parseFloat(req.query.score)
  console.log(req.query.purpose+" "+ req.query.uid+" "+req.query.score)
  let users = []
  if("quality"==purpose){
    users = await User.find({
      avgScore: { $lt: score+10, $gt : score-10},
      _id: {$ne: uid}
    })
  } else if ("experience"==purpose){
    users = await User.find({
      $or:[
        {avgScore: {$gt : score+10, $lt : score+20}},
        {avgScore: {$lt : score-10, $gt : score-20}}
      ],
      _id: {$ne: uid}
    })
  } else {
    users = await User.find({
      $or:[
        {avgScore: {$gt : score+20, $lt : score+30}},
        {avgScore: {$lt : score-20, $gt : score-30}}
      ],
      _id: {$ne: uid}
    })
    console.log(purpose)
  }
  res.send(users)
}

exports.searchStudent = async (req, res) => {
  const search = req.query.search
  const section_id = req.query.section_id
  const selectStudent = 'SELECT * FROM enrollment AS e JOIN student AS s ON e.student_id = s.student_id WHERE e.section_id = ' + section_id + ' AND (s.first_name LIKE \'%' + search + '%\' OR s.last_name LIKE \'%' + search + '%\')'
  const students = await con.searchStudent(selectStudent)
  var user;
  for (_index in students) {
    user = await User.findOne({
      username: students[_index].username
    })
    if(user != null) {
      students[_index].avg_score = user.avgScore
      students[_index].img = user.img
      students[_index].total_time = user.totalTime
    }
  }
  res.send({students: students, purpose: 'none'})
}

exports.searchStudentByPurpose = async (req, res) => {
  const purpose = req.query.purpose
  const section_id = req.query.section_id
  const avg_score = parseFloat(req.query.avg_score)
  const username = req.query.username
  let students = []
  let users = []
  if("quality"==purpose){
    users = await User.find({
      avgScore: { $lte: avg_score+10, $gte : avg_score-10},
      username: {$ne: username}
    })
    console.log('purpose : ' + req.query.purpose + ', avg_score : ' + parseFloat(req.query.avg_score) + ', users.length : ', users)
  } else if ("experience"==purpose){
    users = await User.find({
      $or:[
        {avgScore: {$gt : avg_score+10, $lt : avg_score+20}},
        {avgScore: {$lt : avg_score-10, $gt : avg_score-20}}
      ],
      username: {$ne: username}
    })
    console.log('purpose : ' + req.query.purpose + ', avg_score : ' + parseFloat(req.query.avg_score) + ', users.length : ' + users.length)
  } else {
    users = await User.find({
      $or:[
        {avgScore: {$gt : avg_score+20, $lt : avg_score+30}},
        {avgScore: {$lt : avg_score-20, $gt : avg_score-30}}
      ],
      username: {$ne: username}
    })
    console.log('purpose : ' + req.query.purpose + ', avg_score : ' + parseFloat(req.query.avg_score) + ', users.length : ' + users.length)
  }
  let count = 0;
  for(_index in users){
    let queryStudent = 'SELECT * FROM student AS st JOIN enrollment AS e ON st.student_id = e.student_id AND username = \'' + users[_index].username + '\' AND e.section_id = ' + section_id
    let student = await con.getStudent(queryStudent)
    if(student.length) {
      students[count] = student[0]
      students[count].avg_score = users[_index].avgScore
      students[count].img = users[_index].img
      students[count].total_time = users[_index].totalTime
      count++;
    }
  }
  res.send({students: students, purpose: purpose})
}

exports.createPairingHistory = async (req, res) => {
  const partner_keys = JSON.parse(req.body.partner_keys)
  const pairing_objective = JSON.parse(req.body.pairing_objective)
  const student_objects = JSON.parse(req.body.student_objects)
  var res_status = 'Confirm completed.'
  var count = 0;

  var pairing_history_values = []
  var addPartnerToStudent;
  var selectEnrollment;
  var enrollment_value;
  var pairing_history_value;

  //if there aren't student pairing, server will send message which 'Please, pair all student!'
  for(key in partner_keys){
    if(partner_keys[key] < 0) {
      res_status = 'Please pair all students!'
      res.send({res_status: res_status})
      return
    }
    count++;
  }

  //if there aren't student in classroom, server will send message which 'There aren't student in classroom!'
  if(!count){
    res_status = 'There is no student in the classroom!'
    res.send({res_status: res_status})
    return
  }

  //define sesstion time
  const queryPairingDateTime = 'SELECT * FROM pairing_session WHERE section_id = ' + req.body.section_id
  const pairingDateTime = await con.getPairingDateTime(queryPairingDateTime)
  const pairingTime = pairingDateTime.length

  //create new pairing session
  const createPairingDateTime = 'INSERT INTO pairing_session (section_id, date_time, status) VALUES ?'
  const querySection = 'SELECT * FROM section AS s WHERE s.section_id = ' + req.body.section_id + '';
  const section = await con.getSection(querySection);
  console.log('section_id : ' + section[0].section_id)

  //create date time at this moment
  var date_time = new Date()
  var str_date_time = date_time.toString()
  var split_date_time = str_date_time.split(' ')
  var slice_date_time = split_date_time.slice(0, 5)
  date_time = slice_date_time.join(' ')

  console.log('date_time : ' + date_time)
  const values = [[section[0].section_id, date_time, 2]]
  const pairing_date_time_id = await con.createPairingDateTime(createPairingDateTime, values)

  console.log('pairing_date_time_id : ', typeof pairing_date_time_id)
  if(typeof pairing_date_time_id == 'number') {
    // let pairing_session_latest = {}
    // pairing_session_latest['pairing_date_time_id'] = pairing_date_time_id
    // pairing_session_latest['section_id'] = section[0].section_id
    // pairing_session_latest['date_time'] = date_time
    // pairing_session_latest['status'] = 2
    console.log('1')

    count = 0;
    for(key in partner_keys){
      addPartnerToStudent = 'UPDATE enrollment SET partner_id = ' + partner_keys[key] + ' WHERE enrollment_id = ' + key
      res_status = await con.updateEnrollment(addPartnerToStudent);

      if(res_status == 'Update failed.') {
        res.send({res_status: res_status})
        return
      } else {
        selectEnrollment = 'SELECT * FROM enrollment WHERE enrollment_id = ' + key
        enrollment_value = await con.getEnrollment(selectEnrollment)
        pairing_history_value = [parseInt(key), parseInt(pairing_date_time_id), partner_keys[key], pairing_objective[key], "host"]
        pairing_history_values[count] = pairing_history_value
        count++;

        addPartnerToStudent = 'UPDATE enrollment SET partner_id = ' + key + ' WHERE enrollment_id = ' + partner_keys[key]
        res_status = await con.updateEnrollment(addPartnerToStudent);

        if(res_status == 'Update failed.') {
          res.send({res_status: res_status})
        } else {

          selectEnrollment = 'SELECT * FROM enrollment WHERE enrollment_id = ' + partner_keys[key]
          enrollment_value = await con.getEnrollment(selectEnrollment)
          pairing_history_value = [partner_keys[key], parseInt(pairing_date_time_id), parseInt(key), pairing_objective[partner_keys[key]], "partner"]
          pairing_history_values[count] = pairing_history_value
          count++;
        }
      }
    }

    console.log('pairing_history_values: ', pairing_history_values)
    const createPairingHistory = 'INSERT INTO pairing_history (enrollment_id, pairing_session_id, partner_id, pairing_objective, role) VALUES ?'
    res_status = await con.createPairingHistory(createPairingHistory, pairing_history_values)

    if(res_status == 'Create completed.'){
      console.log('2')
      const updateStatus = 'UPDATE pairing_session SET status = 2 WHERE pairing_session_id = ' + pairing_date_time_id
      res_status = await con.updatePairingDateTime(updateStatus)
    }
    console.log('date_time: ' + date_time)
    res.send({res_status: res_status, pairing_date_time_id: pairing_date_time_id, pairingTime: pairingTime, date_time: date_time, time_end: '-'})
  } else {
    res.send({res_status: 'Update failed.'})
  }
}

exports.getStudentsFromSection = async (req, res) => {
  var partner_keys = JSON.parse(req.query.partner_keys)
  var pairing_objective = JSON.parse(req.query.pairing_objective)
  const pairing_date_time_id = req.query.pairing_date_time_id
  const command = req.query.command
  //console.log('partner_keys: ' + partner_keys + ', pairing_objective: ' + pairing_objective)
  const queryStudent = 'SELECT * FROM student AS st JOIN enrollment AS e ON st.student_id = e.student_id AND e.section_id = ' + req.query.section_id + ' ORDER BY st.first_name ASC';
  const students = await con.getStudent(queryStudent)
  var arePairingsActive = false;
  for(i in students){
    if(students[i].partner_id != null) {
      arePairingsActive = true;
    }
    let user = await User.findOne({
      username: students[i].username
    })
    students[i].avg_score = user.avgScore
    students[i].img = user.img
    students[i].total_time = user.totalTime
  }
  var count = 0
  for(_index in partner_keys){
    count++;
    break
  }
  if(!count && !arePairingsActive && command == 'pair'){
    for(_index in students) {
      console.log(students[_index])
      partner_keys[students[_index].enrollment_id] = -1
      pairing_objective[students[_index].enrollment_id] = -1
    }
  } else if (command == 'view') {
    const selectPairingHistory = 'SELECT * FROM pairing_history WHERE pairing_session_id = ' + pairing_date_time_id
    const pairing_history_values = await con.getPairingHistory(selectPairingHistory);
    var pairing_history_objects = {}
    for(_index in pairing_history_values) {
      pairing_history_objects[pairing_history_values[_index].enrollment_id] = pairing_history_values[_index]
      //console.log('objects' + pairing_history_values[_index].enrollment_id + ' : ', pairing_history_objects[pairing_history_values.enrollment_id])
    }
    var key;
    for(_index in pairing_history_values) {
      //find key from value
      key = Object.keys(partner_keys).find(key => partner_keys[key] === pairing_history_values[_index].enrollment_id)
      if(partner_keys[pairing_history_values[_index].enrollment_id] === undefined && partner_keys[key] === undefined) {
        if(pairing_history_objects[pairing_history_values[_index].enrollment_id].role == 'host') {
          partner_keys[pairing_history_values[_index].enrollment_id] = pairing_history_values[_index].partner_id
        } else if(pairing_history_objects[pairing_history_values[_index].enrollment_id].role == 'partner') {
          partner_keys[pairing_history_values[_index].partner_id] = pairing_history_values[_index].enrollment_id
        }
        pairing_objective[pairing_history_values[_index].enrollment_id] = pairing_history_objects[pairing_history_values[_index].enrollment_id].pairing_objective
        pairing_objective[pairing_history_values[_index].partner_id] = pairing_history_objects[pairing_history_values[_index].partner_id].pairing_objective
      }

    }
  }
  var student_objects = {}
  for(_index in students) {
    student_objects[students[_index].enrollment_id] = students[_index]
  }
  res.send({student_objects: student_objects, partner_keys: partner_keys, pairing_objective: pairing_objective})
}

exports.createAssignment = async (req, res) => {
  console.log('section_id: ' + parseInt(req.body.section_id) + ', title: ' + req.body.title + ', description: ' + req.body.description + ', input_specification: ' + req.body.input_specification + ', output_specification: ' + req.body.output_specification + ', sample_input: ' + req.body.sample_input + ', sample_output: ' + req.body.sample_output)
  const section_id = parseInt(req.body.section_id)
  const title = req.body.title
  const description = req.body.description
  const input_specification = req.body.input_specification
  const output_specification = req.body.output_specification
  const sample_input = req.body.sample_input
  const sample_output = req.body.sample_output
  const createAssignment = 'INSERT INTO assignment (section_id, title, description, input_specification, output_specification, sample_input, sample_output) VALUES ?'
  const values = [[section_id, title, description, input_specification, output_specification, sample_input, sample_output]]
  const assignment_id = await con.createAssignment(createAssignment, values)
  var assignment = {}
  if(typeof assignment_id == 'number') {
    assignment.title = title
    assignment.description = description
    assignment.input_specification = input_specification
    assignment.output_specification = output_specification
    assignment.sample_input = sample_input
    assignment.sample_output = sample_output
  } else {
    assignment.title = 'title'
    assignment.description = 'description'
    assignment.input_specification = 'input_specification'
    assignment.output_specification = 'output_specification'
    assignment.sample_input = 'sample_input'
    assignment.sample_output = 'sample_output'
  }
  res.render('assignment', {assignment, section_id, title: title})
}

exports.updateAssignment = async (req, res) => {
  const assignment_id = req.body.assignment_id
  const section_id = req.body.section_id
  const title = req.body.title
  const description = req.body.description
  const input_specification = req.body.input_specification
  const output_specification = req.body.output_specification
  const sample_input = req.body.sample_input
  const sample_output = req.body.sample_output
  console.log('assignment_id: ' + assignment_id + ', section_id: ' + section_id)
  console.log('title: ' + req.body.title + ', description: ' + req.body.description + ', input_specification: ' + req.body.input_specification + ', output_specification: ' + req.body.output_specification + ', sample_input: ' + req.body.sample_input + ', sample_output: ' + req.body.sample_output)
  const updateAssignment = 'UPDATE assignment SET title = \'' + req.body.title + '\', description = \'' + req.body.description + '\', input_specification = \'' + req.body.input_specification + '\', output_specification = \'' + req.body.output_specification + '\', sample_input = \'' + req.body.sample_input + '\', sample_output = \'' + req.body.sample_output + '\' WHERE assignment_id = ' + assignment_id
  const res_status = await con.updateAssignment(updateAssignment)
  res.redirect('/assignment?section_id='+section_id+'&assignment_id='+assignment_id)
}

exports.getAssignment = async (req, res) => {
  const section_id = req.query.section_id
  const queryAssignment = 'SELECT * FROM assignment WHERE assignment_id = ' + req.query.assignment_id
  var assignment = await con.getAssignment(queryAssignment)
  var title = 'Assignment'
  if(assignment.length) {
    assignment = assignment[0]
    title = assignment.title
  }
  res.render('assignment', {assignment, section_id, title: title})
}

exports.assignAssignment = async (req, res) => {
  console.log('section_id : ' + req.body.section_id)
  const selectEnrollmentBySectionId = 'SELECT * FROM enrollment WHERE section_id = ' + req.body.section_id
  const enrollments = await con.getEnrollment(selectEnrollmentBySectionId);
  var count = 0;
  //check student pairing
  for (_index in enrollments) {
    if(enrollments[_index].partner_id != null) {
      count++;
      break
    }
  }
  if(!count){
    res.send({res_status: 'Please pair all students before assign the assignment!'})
    return
    console.log('Please pair all students before assign the assignment!')
  }
  const pairing_date_time_id = req.body.pairing_date_time_id;
  const assignment_id = parseInt(req.body.assignment_id)
  const title = req.body.title;
  const description = req.body.description;
  const swaptime = '1';
  const language = '0';
  const selectStudent = 'SELECT * FROM student AS st JOIN enrollment AS e ON st.student_id = e.student_id JOIN pairing_history AS ph ON e.enrollment_id = ph.enrollment_id WHERE pairing_session_id = ' + pairing_date_time_id
  var students = await con.getStudent(selectStudent);
  console.log('students : ' + students)
  var partner_keys = {}
  var already_received = {}
  var creator = 'username';
  var collaborator = 'username';
  var student_objects = {}
  var project = new Project();
  for(_index in students) {
    student_objects[students[_index].enrollment_id] = students[_index]
    count++;
  }

  var select_project = {};
  for(key in student_objects) {
    if(student_objects[key].role == 'host') {
      select_project = await Project.findOne({
        assignment_id: assignment_id,
        creator: student_objects[key].username
      })
      console.log('creator : ', student_objects[key].username)
    } else if(student_objects[key].role == 'partner') {
      select_project = await Project.findOne({
        assignment_id: assignment_id,
        collaborator: student_objects[key].username
      })
      console.log('collaborator : ', student_objects[key].username)
    }
    console.log('select_project : ', select_project)
    if(select_project != null && (select_project.creator == student_objects[key].username || select_project.collaborator == student_objects[key].username)) {
      console.log('Whattt')
      if(student_objects[key].role == 'host') {
        already_received[key] = student_objects[key].partner_id
      } else if(student_objects[key].role == 'partner') {
        already_received[student_objects[key].partner_id] = key
      }
      console.log('delete!')
      delete student_objects[student_objects[key].partner_id]
      delete student_objects[key]
    }
  }

  console.log('student_objects : ', student_objects)
  count = 0;
  console.log('already_received : ', already_received)
  for(_key in student_objects) {
    count++;
    project = new Project()
    project.title = title;
    project.description = description;
    project.language = language;
    project.swaptime = swaptime;
    project.status = '';
    //find key from value
    key = Object.keys(already_received).find(key => already_received[key] === _key)
    console.log('key : ' + key)
    if(already_received[_key] === undefined && already_received[key] === undefined) {
      if(student_objects[_key].role == 'host') {
        console.log('host')
        already_received[_key] = student_objects[_key].partner_id
        creator = student_objects[_key].username
        collaborator = student_objects[student_objects[_key].partner_id].username
        console.log('host : ', student_objects[_key].username,', partner : ', student_objects[student_objects[_key].partner_id].username)
      } else if(student_objects[_key].role == 'partner') {
        console.log('partner')
        already_received[student_objects[_key].partner_id] = _key
        creator = student_objects[student_objects[_key].partner_id].username
        collaborator = student_objects[_key].username
        console.log('host : ', student_objects[student_objects[_key].partner_id].username,', partner : ', student_objects[_key].username)
      }
      delete student_objects[student_objects[_key].partner_id]

      project.creator = creator;
      project.collaborator = collaborator;
      creator = await User
      .findOne({ username: creator})
      collaborator = await User
      .findOne({ username: collaborator})
      if (collaborator != null) {
        project = await (project).save()
        Project.update({
          _id: project._id
        }, {
          $set: {
            creator_id: creator._id,
            collaborator_id: collaborator._id,
            assignment_id: assignment_id
          }
        }, (err) => {
          if (err) throw err
        })
        //create directory
        var dir1 = './public/project_files';
        var dir2 = './public/project_files/'+project.pid;
        if (!fs.existsSync(dir1)){
          fs.mkdirSync(dir1);
        }
        if (!fs.existsSync(dir2)){
          fs.mkdirSync(dir2);
        }
        fs.open('./public/project_files/'+project.pid+'/main.py', 'w', function (err, file) {
          if (err) throw err;
          console.log('file '+project.pid+'.py is created');
        })

      } else {
        console.log('error', "Can't find @" + collaborator)
      }
    }
  }
  if(!count) {
    res.send({res_status: 'You already assigned this assignment!'})
  } else {
    res.send({res_status: 'Successfully assigned this assignment!'})
  }
  console.log('Count : ' + count)
}

exports.acceptInvite = async (req, res) => {
  const id = req.body.id
  Project.update({
      pid: id
    }, {
      $set: {
        status: ""
      }
    }, function(err, result){
      if(err) res.send("error")
      if(result) {
        res.send("success")
        // res.redirect(303,'/dashboard')
      }
    })
}

exports.declineInvite = async (req, res) => {
  const id = req.body.id
  Project.remove({
      pid: id
    }, function(err, result){
      if(err) res.send("error")
      if(result) {
        res.send("success")
        // res.redirect(303,'/dashboard')
      }
    })
}

exports.getProgress = async (req, res) => {
  console.log('asdfffffffffffffffffffaaaaaaa')
  const uid = req.query.uid
  let data = {};
  let projectTitles = [];
  let projectTimes = [];
  let projectScores = [];
  let linesOfCodes = [];
  let productivitys = [];
  let errors = [];


  const user = await User.findOne({
    _id: uid
  })
  console.log(1)
  const scores = await Score.find({
    uid: uid
  })
  console.log(2)
  for(var i = 0; i < scores.length; i++) {
    // project title (label)
    project = await Project.findOne({
      pid: scores[i].pid
    })
    console.log(3, ' title : ' + project)
    projectTitles.push(project.title)
    console.log(4)
    // project time data
    projectTimes.push((scores[i].time/60).toFixed(2))
    console.log(5)
    // project score data
    projectScores.push(scores[i].score)
    console.log(6)
    // lines of code data
    linesOfCodes.push(scores[i].lines_of_code)
    console.log(7)
    // productivity
    productivitys.push((scores[i].lines_of_code/(scores[i].time/60)).toFixed(2))
    console.log(8)
    // error data
    errors.push(scores[i].error_count)
  }

  data['fullname'] = user.info.firstname + ' ' + user.info.lastname;
  data['username'] = user.username;
  data['user-score'] = user.avgScore;
  data['user-time'] = parseFloat(user.totalTime/60);
  data['projectTitles'] = projectTitles;
  data['projectTimes'] = projectTimes;
  data['projectScores'] = projectScores;
  data['linesOfCodes'] = linesOfCodes;
  data['productivitys'] = productivitys;
  data['errors'] = errors;
  console.log(data)
  res.send(data)
}
