// import { useEffect, useState } from "react";

// import GoalHeader from "@/components/goals/GoalHeader";
// import GoalGrid from "@/components/goals/GoalGrid";

// import { goalsService } from "@/services/goalsService";

// export default function Goals() {
//   const [goals, setGoals] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadGoals();
//   }, []);

//   async function loadGoals() {
//     try {
//       setLoading(true);

//       const data = await goalsService.getGoals();

//       setGoals(data);
//     } catch (error) {
//       console.error("Failed to load goals:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleOpenCreateModal() {
//     console.log("Open Create Goal Modal");
//   }

//   if (loading) {
//     return (
//       <div className="p-8 text-center text-slate-500">
//         Loading goals...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">

//       <GoalHeader
//         onCreateGoal={handleOpenCreateModal}
//       />

//       <GoalGrid
//         goals={goals}
//         onSelectGoal={(goal) => console.log(goal)}
//       />

//     </div>
//   );
// }


export default function Goals() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Goals Page Works
      </h1>
    </div>
  );
}