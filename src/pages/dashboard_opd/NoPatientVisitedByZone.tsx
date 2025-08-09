import NoPatientsVisitedByZoneBanner from "../../assets/dashboard/NoPatientsVisitedByZoneBanner.png"

const NoPatientVisitedByZone = ()=> (

    <div style ={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:"20%"}}>
        <img src = {NoPatientsVisitedByZoneBanner} alt = "no patient visited by zone" style ={{width:"160px"}} /> 
        <p style ={{width:"250px", fontStyle:"italic", textAlign:"center",color :"#d8dadd", fontWeight:200}}>Looks empty! Start adding data to visualize trends</p>
    </div>
)



export default NoPatientVisitedByZone