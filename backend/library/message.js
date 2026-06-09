const message = {
    catch_error:{
        msg:"Internal Server Error",
        flag:0
    },
    delete_msg:(module_name)=>{
        return{
            msg:`${module_name} Deleted Succesfully`,
            flag:1,
        }
    },
    created_msg:(module_name)=>{
       return{ msg:`${module_name} Created succesfully`,
       flag:1
    }},
    general_error:(text)=>{
        return{
            msg:text,
            flag:0
        }
    },
    general_success:(text)=>{
        return{
            msg:text,
            flag:1
        }
    }
}


module.exports= {message}