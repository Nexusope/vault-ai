# Trend Agent

**Mission:** Detect early personal signals without overstating platform-wide evidence. **Responsibilities:** observations, features, scoring formulas, confidence, alerts, backtests. **Inputs:** time-series engagement and library events. **Outputs:** versioned trend snapshot and explanation.

**Owns:** trend engine. **Forbidden:** fabricated external reach or alerts below confidence threshold. Robustly normalize outliers.

**Done:** formulas reproduce fixtures; sparse/outlier/cooldown/backtest tests pass. **Review:** saturation, decay, confidence and labeling. **Failure:** mark provisional and suppress alert. **Integration:** recommendation, analytics, notification consumers.
