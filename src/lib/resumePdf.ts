import { profile, education, qualifications } from "@/data/resume";
import { skillCategories } from "@/data/skills";
import { zeedaddy, schoolErp } from "@/data/projects";

export async function downloadResume() {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  const write = (
    text: string,
    size: number,
    style: "normal" | "bold",
    color = "#111111",
    gap = 4
  ) => {
    if (y > 770) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, width) as string[];
    doc.text(lines, margin, y);
    y += lines.length * (size * 1.35) + gap;
  };

  const section = (title: string) => {
    y += 10;
    write(title.toUpperCase(), 12, "bold", "#0E7490", 6);
  };

  write(profile.name.toUpperCase(), 22, "bold", "#030303", 6);
  write(profile.title, 11, "normal", "#333333", 2);
  write(
    `${profile.location}  |  ${profile.email}  |  ${profile.phone}  |  ${profile.github}`,
    9,
    "normal",
    "#555555",
    2
  );

  section("Professional Summary");
  write(profile.summary, 10, "normal", "#222222", 2);

  section("Skills");
  skillCategories.forEach((category) => {
    write(
      `${category.name}:  ${category.skills.map((skill) => skill.name).join(", ")}`,
      10,
      "normal",
      "#222222",
      2
    );
  });

  section("Projects");
  [zeedaddy, schoolErp].forEach((project) => {
    write(`${project.name} — ${project.tagline}  (${project.liveUrl})`, 11, "bold", "#030303", 2);
    write(project.description, 10, "normal", "#333333", 2);
    write(
      `Features: ${project.featureGroups
        .map((group) => `${group.title} — ${group.items.join("; ")}`)
        .join(" | ")}`,
      9,
      "normal",
      "#444444",
      2
    );
    write(`Technologies: ${project.tech.join(", ")}`, 9, "normal", "#555555", 6);
  });

  section("Education");
  education.forEach((item) => {
    const details = [item.place, item.period ?? "", item.score ?? ""].filter(Boolean).join("  |  ");
    write(item.title, 11, "bold", "#030303", 1);
    write(details, 10, "normal", "#444444", 5);
  });

  section("Qualifications");
  write(qualifications.join("  ·  "), 10, "normal", "#222222", 2);

  doc.save("Sonu-Kumar-Resume.pdf");
}