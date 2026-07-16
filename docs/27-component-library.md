# Component Library

Core primitives are Button, IconButton, Input, Textarea, Select, Toggle, Badge, Score, StatusDot, Panel, Dialog, Toast, Tooltip, Tabs, Skeleton, EmptyState, ErrorState, and VisuallyHidden. Product components are IdeaCard, IdeaListRow, IdeaNode, GalaxyCanvas, FusionSource, FusionResult, TrendBadge, AssistantMessage, Composer, SearchResult, CollectionCard, MediaViewer, TranscriptPanel, InsightCard, MetricStrip, ActivityRow, and ProviderRoute.

Each component exposes semantic props, not styling escape hatches. Buttons use intent/size/loading/disabled; IdeaCard takes typed idea, selection state, density, and actions; badges take status enum; dialogs own focus trap, labelled title, Escape, backdrop, and focus restoration. Lists use stable ids and virtualization above 200 items.

Story cases cover default, hover, focus, selected, disabled, loading, empty, error, long text, missing media, and narrow viewport. Components contain no direct API calls except boundary containers. Accessibility tests assert names, roles, state, focus order, and reduced motion. Visual regression covers green/cyan/orange signal variants and 320/768/1440 px widths.
