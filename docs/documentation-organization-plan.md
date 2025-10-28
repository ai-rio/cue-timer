# CueTimer Documentation Organization Plan

**Purpose**: Comprehensive reorganization of all repository documentation using
doc-organizer skill standards **Status**: Ready for Implementation **Created**:
2025-10-26

---

## 🎯 Organization Goals

1. **No documentation in repository root** - all docs properly organized
2. **Consistent kebab-case naming** across all documentation files
3. **Proper folder hierarchy** based on doc-organizer standards
4. **Updated cross-references** after reorganization
5. **Unified CueTimer branding** throughout all documentation

---

## 📊 Current State Analysis

### Issues Identified

#### 🔴 Critical Issues

- **5 root-level documentation files** need immediate relocation
- **Inconsistent naming** (underscores, mixed case, non-kebab-case)
- **Duplicate/redirect files** creating confusion
- **Scattered documentation** across multiple directories

#### 🟡 High Priority Issues

- **Missing API documentation** folder structure
- **Blog-management isolated** from main docs structure
- **Components documentation** not properly organized
- **Contributing guidelines** scattered

#### 🟢 Medium Priority Issues

- **Assets folder** needs proper organization
- **Index files** need updating for new structure
- **Internal links** need updating after reorganization

### Root-Level Files to Move

```
/PHASE_1_TASKS.md → docs/phase-reports/phase-1-tasks.md
/PHASE_1_TASKS-ARCHIVED.md → docs/phase-reports/phase-1-tasks-archived.md
/PHASE_1_AUDIT_REPORT.md → docs/phase-reports/phase-1-audit-report.md
/DESIGN_SYSTEM_IMPLEMENTATION.md → docs/phase-reports/design-system-implementation.md
/TIMER_VISIBILITY_FIX.md → docs/development/guides/timer-visibility-fix.md
```

### Files Requiring Naming Convention Updates

```
docs/phase-reports/DESIGN_SYSTEM_IMPLEMENTATION.md → design-system-implementation.md
docs/phase-reports/PHASE_1_AUDIT_REPORT.md → phase-1-audit-report.md
docs/phase-reports/PHASE_1_TASKS-ARCHIVED.md → phase-1-tasks-archived.md
docs/phase-reports/PHASE_1_TASKS.md → phase-1-tasks.md
docs/phase-reports/PHASE_4_IMPLEMENTATION_SUMMARY.md → phase-4-implementation-summary.md
docs/strategy/roadmap/CONSOLIDATION_SUMMARY.md → consolidation-summary.md
docs/strategy/roadmap/project-roadmap-ARCHIVED.md → project-roadmap-archived.md
docs/development/guides/TIMER_VISIBILITY_FIX.md → timer-visibility-fix.md
docs/development/guides/quotekit-integration-plan.md → quotekit-reference-only-policy.md (content update needed)
docs/development/roadmap/next-steps-ARCHIVED.md → next-steps-archived.md
docs/testing/COVERAGE-REPORT.md → coverage-report.md
docs/blog-management/internal-linking-automation-design.md → internal-linking-automation-design.md
```

---

## 🏗️ Target Documentation Structure

```
docs/
├── README.md                           # Main documentation hub
├── INDEX.md                            # Comprehensive index
├── assets/                             # Images, diagrams, examples
│   ├── images/
│   ├── diagrams/
│   └── examples/
├── api/                                # API documentation (NEW)
│   ├── README.md
│   ├── endpoints/
│   ├── authentication/
│   └── examples/
├── architecture/                       # Architecture decisions & diagrams
│   ├── README.md
│   ├── system-architecture.md
│   ├── mobile-pwa-architecture.md
│   └── design-decisions/
├── blog-management/                    # Blog system documentation (MAINTAIN)
│   ├── README.md
│   ├── api-reference.md
│   ├── cli-reference.md
│   ├── deployment.md
│   ├── developer-guide.md
│   ├── system-certification.md
│   ├── templates.md
│   ├── troubleshooting.md
│   ├── workflow.md
│   ├── internal-linking/
│   │   ├── README.md
│   │   ├── usage-guide.md
│   │   ├── api-reference.md
│   │   ├── configuration.md
│   │   ├── examples.md
│   │   ├── integration.md
│   │   ├── cli-reference.md
│   │   ├── organization-summary.md
│   │   ├── troubleshooting.md
│   │   └── original-examples/
│   └── deployment-readiness.md
├── components/                         # Component documentation (NEW)
│   ├── README.md
│   ├── ui/
│   ├── timer/
│   ├── layout/
│   └── blog/
├── contributing/                       # Contributing guidelines (REORGANIZE)
│   ├── README.md
│   ├── development-workflow.md
│   ├── code-of-conduct.md
│   ├── pull-request-template.md
│   └── issue-reporting.md
├── design/                             # Design documentation (MAINTAIN)
│   ├── branding/
│   │   ├── design-system.md
│   │   └── brand-guidelines.md
│   ├── ui-ux/
│   │   ├── user-interface-guidelines.md
│   │   └── messaging-system-specifications.md
│   └── technical-specs/
│       ├── system-architecture.md
│       └── mobile-pwa-architecture.md
├── development/                        # Development documentation (MAINTAIN)
│   ├── README.md
│   ├── architecture/
│   │   └── project-architecture.md
│   ├── setup/
│   │   └── technical-setup-summary.md
│   ├── guides/
│   │   ├── development-workflow.md
│   │   ├── git-workflow-guide.md
│   │   ├── powersync-implementation-guide.md
│   │   ├── quotekit-reference-only-policy.md
│   │   ├── timer-visibility-fix.md
│   │   └── troubleshooting-guide.md
│   ├── roadmap/
│   │   ├── next-steps.md
│   │   └── next-steps-archived.md
│   └── type-check/
│       ├── README.md
│       ├── implementation-summary.md
│       ├── integration-guide.md
│       ├── quick-reference.md
│       ├── troubleshooting.md
│       ├── type-automation-summary.md
│       └── type-check-verification-report.md
├── phase-reports/                      # Project phase reports (REORGANIZE)
│   ├── README.md
│   ├── phase-1-audit-report.md
│   ├── phase-1-tasks.md
│   ├── phase-1-tasks-archived.md
│   ├── phase-4-implementation-summary.md
│   └── design-system-implementation.md
├── guides/                             # User guides and tutorials (NEW)
│   ├── README.md
│   ├── getting-started/
│   ├── user-guides/
│   ├── tutorials/
│   └── troubleshooting/
├── planning/                           # Planning documentation (REORGANIZE)
│   ├── README.md
│   ├── 2024-10-25-blog-management-implementation-plan.md
│   ├── 2025-01-25-aggressive-eslint-agent-deployment-design.md
│   └── 2025-10-26-internal-linking-automation.md
├── research/                           # Research documentation (MAINTAIN)
│   ├── README.md
│   └── competitor-analysis/
│       └── competitive-landscape.md
├── strategy/                           # Strategy documentation (MAINTAIN)
│   ├── README.md
│   ├── content-strategy.md
│   ├── help-documentation.md
│   ├── keyword-integrated-content-strategy.md
│   ├── marketing-messaging.md
│   ├── user-onboarding-content.md
│   ├── project-planning/
│   │   ├── ideal-customer-profile.md
│   │   ├── offline-first-feasibility-report.md
│   │   └── project-brief.md
│   ├── go-to-market/
│   │   └── go-to-market-strategy.md
│   └── roadmap/
│       ├── project-roadmap.md
│       ├── project-roadmap-master.md
│       ├── project-roadmap-archived.md
│       └── consolidation-summary.md
├── templates/                          # Templates (MAINTAIN)
│   ├── README.md
│   └── prompts/
│       └── creative-team-prompt.md
└── validation/                         # Validation reports (NEW)
    ├── README.md
    ├── documentation-overview.md
    ├── validation-summary.md
    └── eslint-reports/
        ├── eslint-disaster-recovery-final-plan.md
        ├── eslint-disaster-recovery-report.md
        └── eslint-maintenance-strategy.md
```

---

## 📋 Implementation Tasks

### Phase 1: Critical Fixes (Immediate)

#### 1.1 Move Root-Level Files

- [ ] Move `/PHASE_1_TASKS.md` → `docs/phase-reports/phase-1-tasks.md`
- [ ] Move `/PHASE_1_TASKS-ARCHIVED.md` →
      `docs/phase-reports/phase-1-tasks-archived.md`
- [ ] Move `/PHASE_1_AUDIT_REPORT.md` →
      `docs/phase-reports/phase-1-audit-report.md`
- [ ] Move `/DESIGN_SYSTEM_IMPLEMENTATION.md` →
      `docs/phase-reports/design-system-implementation.md`
- [ ] Move `/TIMER_VISIBILITY_FIX.md` →
      `docs/development/guides/timer-visibility-fix.md`

#### 1.2 Apply Kebab-Case Naming

- [ ] Rename all files with underscores to kebab-case
- [ ] Update all internal links to use new file names
- [ ] Update main README.md references

#### 1.3 Create Missing Folder Structure

- [ ] Create `docs/api/` folder structure
- [ ] Create `docs/components/` folder structure
- [ ] Create `docs/contributing/` folder structure
- [ ] Create `docs/guides/` folder structure
- [ ] Create `docs/validation/` folder structure
- [ ] Create `docs/assets/` folder structure

### Phase 2: Content Reorganization (1-2 hours)

#### 2.1 Reorganize Scattered Documentation

- [ ] Move ESLint reports to `docs/validation/eslint-reports/`
- [ ] Reorganize contributing guidelines
- [ ] Create proper index files for each folder
- [ ] Update cross-references between documents

#### 2.2 Update Navigation and Indexes

- [ ] Update main `docs/README.md` with new structure
- [ ] Update main `docs/INDEX.md` with new structure
- [ ] Create folder-specific README files
- [ ] Update root `README.md` documentation links

#### 2.3 Internal Link Updates

- [ ] Scan all documents for internal links
- [ ] Update all broken internal links
- [ ] Validate all cross-references work
- [ ] Update any external documentation references

### Phase 3: Quality Assurance (30 minutes)

#### 3.1 Validation

- [ ] Verify no documentation remains in repository root
- [ ] Check all files follow kebab-case naming
- [ ] Validate all internal links work
- [ ] Ensure all README files reflect new structure

#### 3.2 Branding Consistency

- [ ] Apply consistent CueTimer branding
- [ ] Update all document headers
- [ ] Ensure consistent formatting
- [ ] Add navigation footers where appropriate

---

## 🔧 File-by-File Migration Plan

### Root-Level Files

#### PHASE_1_TASKS.md → docs/phase-reports/phase-1-tasks.md

- **Action**: Move and rename
- **Content**: Update internal links
- **Dependencies**: Update root README.md references

#### PHASE_1_AUDIT_REPORT.md → docs/phase-reports/phase-1-audit-report.md

- **Action**: Move and rename
- **Content**: Update internal links
- **Dependencies**: Update any cross-references

#### DESIGN_SYSTEM_IMPLEMENTATION.md → docs/phase-reports/design-system-implementation.md

- **Action**: Move and rename
- **Content**: Update internal links
- **Dependencies**: Update main README.md references

### Naming Convention Updates

#### High Priority Updates

1. `docs/phase-reports/DESIGN_SYSTEM_IMPLEMENTATION.md` →
   `design-system-implementation.md`
2. `docs/phase-reports/PHASE_1_AUDIT_REPORT.md` → `phase-1-audit-report.md`
3. `docs/phase-reports/PHASE_1_TASKS-ARCHIVED.md` → `phase-1-tasks-archived.md`
4. `docs/phase-reports/PHASE_1_TASKS.md` → `phase-1-tasks.md`
5. `docs/development/guides/TIMER_VISIBILITY_FIX.md` → `timer-visibility-fix.md`

#### Medium Priority Updates

1. `docs/strategy/roadmap/CONSOLIDATION_SUMMARY.md` → `consolidation-summary.md`
2. `docs/strategy/roadmap/project-roadmap-ARCHIVED.md` →
   `project-roadmap-archived.md`
3. `docs/development/roadmap/next-steps-ARCHIVED.md` → `next-steps-archived.md`
4. `docs/testing/COVERAGE-REPORT.md` → `coverage-report.md`

---

## 📝 Template for New README Files

### Folder README Template

```markdown
# [Folder Name] Documentation

<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #FF6B35, #F7B801); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
    <span style="color: white; font-size: 24px; font-weight: bold;">[ICON]</span>
  </div>
  <div>
    <h1 style="margin: 0; color: #1A1A1A;">[Folder Name]</h1>
    <p style="margin: 0; color: #666;">[Brief Description]</p>
  </div>
</div>

## 📁 Contents

- **[Document 1]**: [Description]
- **[Document 2]**: [Description]
- **[Document 3]**: [Description]

## 🚀 Quick Start

[Quick start instructions]

## 📚 Related Documentation

- [Related doc 1](../path/to/doc.md)
- [Related doc 2](../path/to/doc.md)

---

**Last Updated:** [DATE] **Maintained by:** CueTimer Team
```

---

## 🔍 Validation Checklist

### Pre-Implementation

- [ ] Current documentation state fully analyzed
- [ ] All root-level files identified
- [ ] All naming convention issues catalogued
- [ ] Internal link dependencies mapped

### Post-Implementation

- [ ] No .md files remain in repository root
- [ ] All documentation files use kebab-case naming
- [ ] All folders have proper README files
- [ ] All internal links validate correctly
- [ ] Main README.md updated with new structure
- [ ] Docs README.md updated with new structure
- [ ] All cross-references work correctly
- [ ] Consistent CueTimer branding applied

---

## 📊 Expected Outcomes

### Before Organization

- **Root-level files**: 5 documentation files
- **Naming issues**: 12+ files with non-kebab-case names
- **Scattered docs**: Documentation across 8+ directories
- **Missing structure**: No API, Components, Contributing folders

### After Organization

- **Root-level files**: 0 documentation files ✅
- **Naming consistency**: 100% kebab-case compliance ✅
- **Organized structure**: Proper doc-organizer hierarchy ✅
- **Complete folder set**: All standard documentation folders ✅

---

## 🚀 Implementation Timeline

### Phase 1: Critical Fixes (30 minutes)

- Move root-level files
- Apply kebab-case naming
- Create missing folders

### Phase 2: Content Reorganization (1-2 hours)

- Reorganize scattered documentation
- Update navigation and indexes
- Fix internal links

### Phase 3: Quality Assurance (30 minutes)

- Validation and testing
- Branding consistency
- Final documentation updates

**Total Estimated Time**: 2-3 hours

---

**Next Steps**: Begin Phase 1 implementation by moving root-level files and
creating the missing folder structure.
