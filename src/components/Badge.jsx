export const Badge = ({ label, icon, color }) => (
  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${color}`}>
    <span>{icon}</span> {label}
  </span>
);
