import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function ActionCard({
    icon: Icon,
    title,
    description,
    onClick,
}) {
    return (
        <motion.button
            whileHover={{
                y: -4,
                scale: 1.02,
            }}
            whileTap={{
                scale: 0.98,
            }}
            onClick={onClick}
            className="
                group
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                bg-white
                p-5
                text-left
                shadow-sm
                transition
                hover:border-slate-300
                hover:shadow-md
            "
        >
            <div className="flex items-center gap-4">

                <div
                    className="
                        rounded-xl
                        bg-slate-100
                        p-3
                        transition
                        group-hover:bg-slate-900
                        group-hover:text-white
                    "
                >
                    <Icon size={22} />
                </div>

                <div>

                    <h3 className="font-semibold">
                        {title}
                    </h3>

                    <p className="text-sm text-slate-500">
                        {description}
                    </p>

                </div>

            </div>

            <ChevronRight
                className="
                    text-slate-400
                    transition
                    group-hover:translate-x-1
                "
            />

        </motion.button>
    );
}