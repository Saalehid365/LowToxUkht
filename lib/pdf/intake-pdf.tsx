import "server-only";
import path from "path";
import { Document, Page, View, Text, Font, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { intakeSections, intakePackage, answerText, type IntakeAnswers, type Field } from "@/lib/intake";
import { site } from "@/lib/site";

const fontDir = path.join(process.cwd(), "lib/pdf/fonts");
const font = (f: string) => path.join(fontDir, f);

Font.register({
  family: "Bodoni",
  fonts: [
    { src: font("bodoni-moda-latin-400-normal.woff") },
    { src: font("bodoni-moda-latin-400-italic.woff"), fontStyle: "italic" },
    { src: font("bodoni-moda-latin-500-normal.woff"), fontWeight: 500 },
  ],
});
Font.register({
  family: "Hanken",
  fonts: [
    { src: font("hanken-grotesk-latin-400-normal.woff") },
    { src: font("hanken-grotesk-latin-500-normal.woff"), fontWeight: 500 },
    { src: font("hanken-grotesk-latin-600-normal.woff"), fontWeight: 600 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const c = {
  bottle: "#123c34",
  stone: "#5e6a63",
  faint: "#9aa69f",
  line: "#d3ddd6",
  tint: "#eef3ef",
  amber: "#a8731f",
  amberSoft: "#f6ecd8",
};

const s = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48, fontFamily: "Hanken", fontSize: 9.5, color: c.bottle, lineHeight: 1.45 },
  running: { position: "absolute", top: 22, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: c.faint },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: c.faint },

  brand: { fontFamily: "Bodoni", fontStyle: "italic", fontSize: 13, color: c.amber, marginBottom: 14 },
  title: { fontFamily: "Bodoni", fontSize: 26, lineHeight: 1.25, marginBottom: 8 },
  subtitle: { fontSize: 10, color: c.stone, marginBottom: 20 },

  meta: { flexDirection: "row", borderTopWidth: 1, borderTopColor: c.bottle, borderBottomWidth: 1, borderBottomColor: c.line, marginBottom: 18 },
  metaCell: { flex: 1, paddingVertical: 9, paddingRight: 8 },
  metaLabel: { fontSize: 7.5, color: c.stone, marginBottom: 2 },
  metaValue: { fontSize: 10.5, fontWeight: 500 },

  glance: { backgroundColor: c.amberSoft, padding: 14, marginBottom: 22, borderRadius: 3 },
  glanceTitle: { fontFamily: "Bodoni", fontSize: 13, marginBottom: 8 },
  glanceRow: { flexDirection: "row", marginBottom: 5 },
  glanceLabel: { width: 118, fontSize: 8.5, color: "#6f4a10" },
  glanceValue: { flex: 1, fontSize: 9.5, fontWeight: 500 },

  section: { marginBottom: 16 },
  sectionHead: { flexDirection: "row", alignItems: "baseline", borderBottomWidth: 1.5, borderBottomColor: c.bottle, paddingBottom: 9, marginBottom: 4 },
  sectionNum: { fontFamily: "Bodoni", fontSize: 11, color: c.amber, width: 22 },
  sectionTitle: { fontFamily: "Bodoni", fontSize: 15, lineHeight: 1.3 },
  groupTitle: { fontSize: 8.5, fontWeight: 600, color: c.stone, marginTop: 10, marginBottom: 2 },

  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: c.line, paddingVertical: 6 },
  q: { width: "42%", paddingRight: 14, color: c.stone, fontSize: 8.5 },
  a: { width: "58%", fontSize: 9.5 },
  empty: { color: c.faint, fontStyle: "normal" },

  checks: { width: "58%" },
  check: { flexDirection: "row", alignItems: "flex-start", marginBottom: 2.5 },
  box: { width: 7, height: 7, borderWidth: 0.75, borderColor: c.faint, marginRight: 6, marginTop: 2.5, borderRadius: 1 },
  boxOn: { backgroundColor: c.bottle, borderColor: c.bottle },
  checkOff: { color: c.faint, fontSize: 9 },
  checkOn: { fontSize: 9.5, fontWeight: 500 },

  notesTitle: { fontFamily: "Bodoni", fontSize: 12.5, marginTop: 4, marginBottom: 6 },
  notesLine: { borderBottomWidth: 0.5, borderBottomColor: c.line, height: 22 },
});

function Answer({ field, answers }: { field: Field; answers: IntakeAnswers }) {
  if (field.kind === "checks") {
    const picked = (answers[field.id] as string[] | undefined) ?? [];
    return (
      <View style={s.row} wrap={false}>
        <Text style={s.q}>{field.label}</Text>
        <View style={s.checks}>
          {field.options.map((o) => {
            const on = picked.includes(o);
            return (
              <View key={o} style={s.check}>
                <View style={on ? [s.box, s.boxOn] : s.box} />
                <Text style={on ? s.checkOn : s.checkOff}>{o}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  let value = answerText(answers, field.id);
  if (field.kind === "date" && value) value = formatDate(value);
  return (
    <View style={s.row} wrap={false}>
      <Text style={s.q}>{field.label}</Text>
      <Text style={value ? s.a : [s.a, s.empty]}>{value || "Not answered"}</Text>
    </View>
  );
}

function formatDate(v: string) {
  const d = new Date(v);
  return isNaN(+d) ? v : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// The details a coach most needs to see before suggesting any product.
const glance: [string, string][] = [
  ["Allergies", "allergies"],
  ["Medications", "medications"],
  ["Other diagnoses", "otherDiagnoses"],
  ["Skin reactions", "skinReactions"],
  ["Professional advice", "professionalAdvice"],
  ["Overwhelm triggers", "triggers"],
  ["Focus areas", "focusAreas"],
];

function IntakeDocument({ answers, submittedAt }: { answers: IntakeAnswers; submittedAt: Date }) {
  const parent = answerText(answers, "parentName");
  const child = answerText(answers, "childName");
  const age = answerText(answers, "childAge");
  const submitted = submittedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const glanceRows = glance.filter(([, id]) => answerText(answers, id));

  return (
    <Document title={`Intake form: ${child || parent}`} author={site.name}>
      <Page size="A4" style={s.page}>
        <View style={s.running} fixed>
          <Text>{site.name} · Family intake</Text>
          <Text>Confidential</Text>
        </View>

        <Text style={s.brand}>{site.name}</Text>
        <Text style={s.title}>Family intake: {child || "Your child"}</Text>
        <Text style={s.subtitle}>{intakePackage.name}</Text>

        <View style={s.meta}>
          {[
            ["Parent or guardian", parent],
            ["Child", [child, age && `age ${age}`].filter(Boolean).join(", ")],
            ["Contact", [answerText(answers, "phone"), answerText(answers, "contactMethod")].filter(Boolean).join(" · ")],
            ["Submitted", submitted],
          ].map(([label, value]) => (
            <View key={label} style={s.metaCell}>
              <Text style={s.metaLabel}>{label}</Text>
              <Text style={s.metaValue}>{value || "Not given"}</Text>
            </View>
          ))}
        </View>

        {glanceRows.length > 0 && (
          <View style={s.glance} wrap={false}>
            <Text style={s.glanceTitle}>Before the session</Text>
            {glanceRows.map(([label, id]) => (
              <View key={id} style={s.glanceRow}>
                <Text style={s.glanceLabel}>{label}</Text>
                <Text style={s.glanceValue}>{answerText(answers, id)}</Text>
              </View>
            ))}
          </View>
        )}

        {intakeSections.map((section, i) => (
          <View key={section.id} style={s.section}>
            <View style={s.sectionHead} wrap={false} minPresenceAhead={60}>
              <Text style={s.sectionNum}>{i + 1}</Text>
              <Text style={s.sectionTitle}>{section.title}</Text>
            </View>
            {section.groups.map((g, gi) => (
              <View key={gi}>
                {g.title && <Text style={s.groupTitle} minPresenceAhead={40}>{g.title}</Text>}
                {g.fields.map((f) => (
                  <Answer key={f.id} field={f} answers={answers} />
                ))}
              </View>
            ))}
          </View>
        ))}

        <View wrap={false}>
          <Text style={s.notesTitle}>Session notes</Text>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={s.notesLine} />
          ))}
        </View>

        <View style={s.footer} fixed>
          <Text>
            {parent} · {child}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

export function renderIntakePdf(answers: IntakeAnswers, submittedAt = new Date()) {
  return renderToBuffer(<IntakeDocument answers={answers} submittedAt={submittedAt} />);
}

export function intakePdfName(answers: IntakeAnswers, submittedAt = new Date()) {
  const who = (answerText(answers, "childName") || answerText(answers, "parentName") || "family").replace(/[^\w-]+/g, "-");
  return `intake-${who}-${submittedAt.toISOString().slice(0, 10)}.pdf`;
}
