import Card from "../../components/common/Card";

export default function AdminTemplates() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Templates</h1>
        <p className="text-sm text-muted mt-1">
          Exercise and meal libraries that power the generation engines.
        </p>
      </div>

      <Card>
        <h2 className="font-semibold mb-2">Exercise Library</h2>
        <p className="text-sm text-muted">
          Defined in <code className="bg-gray-100 rounded px-1.5 py-0.5 text-xs">backend/src/services/exerciseLibrary.js</code>.
          Includes Push, Pull, Legs, Upper Body, Lower Body, Cardio, Full Body, and Mobility categories, each with
          curated exercises and form guidance used by the workout generation engine.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2">Meal Library</h2>
        <p className="text-sm text-muted">
          Defined in <code className="bg-gray-100 rounded px-1.5 py-0.5 text-xs">backend/src/services/mealLibrary.js</code>.
          Includes protein, carb, fat, and vegetable sources with calorie/macro data, plus a substitution map that
          powers the meal swap engine.
        </p>
      </Card>

      <Card className="border border-amber-200 bg-amber-50/50">
        <p className="text-sm text-amber-800">
          Full CRUD management of templates directly from this UI (add/edit/remove individual exercises and foods in
          the database) is a planned enhancement — see <code>docs/architecture.md</code> for the suggested approach.
        </p>
      </Card>
    </div>
  );
}
