import express from 'express'
import { signin, signup,google,signout,asignout,AddStaff,getStaffByUserId,AllStaff,AllUsers,manager_signup,manager_signin,manager_send_email,AddTASK,AllTasks} from '../controllers/auth.controller.js';


const router=express.Router();

router.post("/signup",signup)//register
router.post("/signin",signin)//login
router.post("/google",google)
/*router.post("/google1",google1)*/
router.get('/signout',signout)
router.get('/asignout',asignout)



//staff
router.post("/AddStaff",AddStaff)
router.get("/Staff/:id",getStaffByUserId)//for data fetch according to user id
router.get("/users/AllStaff",AllStaff)
router.get("/users/Allusers",AllUsers)


//manager login & register
router.post("/manager_signup",manager_signup)//register
router.post("/manager_signin",manager_signin)//login
router.post("/manager_send_email",manager_send_email)


//TASK
router.post("/AddTASK",AddTASK)
router.get("/users/AllTasks",AllTasks)





export default router
