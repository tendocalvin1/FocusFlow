import GoalCard from "./GoalCard";

const goals = [

    {

        id:1,

        title:"Become Backend Engineer",

        description:"Master Django, FastAPI and PostgreSQL.",

        progress:68,

        deadline:"Dec 2026",

        priority:"High",

    },

    {

        id:2,

        title:"Launch FocusFlow",

        description:"Ship production MVP.",

        progress:52,

        deadline:"Aug 2026",

        priority:"Medium",

    },

    {

        id:3,

        title:"10k LinkedIn Followers",

        description:"Build engineering brand.",

        progress:25,

        deadline:"2027",

        priority:"Low",

    }

];

export default function GoalGrid() {

    return (

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

            {

                goals.map(goal=>(

                    <GoalCard

                        key={goal.id}

                        {...goal}

                    />

                ))

            }

        </div>

    );

}