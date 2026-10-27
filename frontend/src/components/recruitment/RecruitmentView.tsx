interface RecruitmentViewProps {
  active: boolean;
}

export function RecruitmentView({ active }: RecruitmentViewProps) {
  return (
    <section
      className={`view menu-page recruitment-view ${active ? 'is-active' : ''}`}
      data-view-panel="recrutamento"
      aria-label="Recrutamento de tripulantes"
    >
      <div id="recruitment-content" />
    </section>
  );
}
