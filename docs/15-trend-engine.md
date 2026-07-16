# Trend Engine

For signal `s` in window `t`: velocity `V=(mentions_t-mentions_prev)/max(mentions_prev,1)`; growth `G=ln(1+mentions_t)/ln(1+baseline)`; freshness `F=e^(-age_hours/72)`; saturation `S=min(unique_creators/target_creators,1)`; engagement quality `E=(2*saves+shares+0.5*comments)/max(views,1)`; evergreen `R=1-min(|slope_30d|/peak_slope,1)`.

Trend score is `100 * sigmoid(1.2V + 0.8G + 0.7E + 0.5F + 0.3R - 0.9S - 1.5)`. Inputs are winsorized at the 99th percentile, confidence declines with sparse samples, and scores below confidence 0.6 are labeled provisional. “Rising” requires score ≥70 and positive velocity in two consecutive windows; “fast rising” requires ≥85 and saturation <0.55.

The engine stores raw observations, feature snapshots, score version, and explanation. It never fabricates platform-wide trend data from a user’s private library; workspace trends are labeled personal. Alert deduplication uses signal, threshold, and seven-day cooldown. Backtests compare alerts with future engagement and monitor niche bias.
