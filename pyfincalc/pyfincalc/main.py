from __future__ import annotations

import json
import math
import sys

FREQUENCY_PERIODS: dict[str, int] = {"daily": 365, "monthly": 12, "yearly": 1}
FREQUENCY_ALIASES: dict[str, str] = {
    "d": "daily",
    "day": "daily",
    "daily": "daily",
    "m": "monthly",
    "month": "monthly",
    "monthly": "monthly",
    "y": "yearly",
    "year": "yearly",
    "annual": "yearly",
    "annually": "yearly",
    "yearly": "yearly",
}
MAX_MONTHS = 12_000


def _normalize_frequency(value: str) -> str:
    choice = FREQUENCY_ALIASES.get(value.strip().lower())
    if choice is None:
        options = ", ".join(FREQUENCY_PERIODS)
        raise ValueError(f"choose one of: {options}")
    return choice


def _prompt_float(
    label: str,
    *,
    minimum: float,
    default: float | None = None,
) -> float:
    hint = f" [{default}]" if default is not None else ""
    while True:
        try:
            raw = input(f"{label}{hint}: ").strip()
        except EOFError:
            raise ValueError("input closed; this tool requires interactive input") from None
        if not raw:
            if default is not None:
                return float(default)
            print("  ! a value is required", file=sys.stderr)
            continue
        cleaned = raw.replace(",", "").replace("$", "").replace("%", "").strip()
        try:
            value = float(cleaned)
        except ValueError:
            print(f"  ! please enter a number, got {raw!r}", file=sys.stderr)
            continue
        if not math.isfinite(value):
            print("  ! please enter a finite number", file=sys.stderr)
            continue
        if value < minimum:
            print(f"  ! value must be at least {minimum}", file=sys.stderr)
            continue
        return value


def _prompt_frequency(default: str = "monthly") -> str:
    options = ", ".join(FREQUENCY_PERIODS)
    while True:
        try:
            raw = input(f"Compounding frequency ({options}) [{default}]: ").strip()
        except EOFError:
            raise ValueError("input closed; this tool requires interactive input") from None
        if not raw:
            return default
        try:
            return _normalize_frequency(raw)
        except ValueError as exc:
            print(f"  ! {exc}", file=sys.stderr)


def project(
    *,
    principal: float,
    monthly_contribution: float,
    annual_rate_percent: float,
    frequency: str,
    years: float,
) -> dict[str, float | int | str]:
    """Compute a monthly-stepped projection and return the summary fields."""
    for name, value in (
        ("initial deposit", principal),
        ("monthly contribution", monthly_contribution),
        ("annual interest rate", annual_rate_percent),
        ("time period", years),
    ):
        if not math.isfinite(value):
            raise ValueError(f"{name} must be a finite number")
        if value < 0:
            raise ValueError(f"{name} cannot be negative")

    freq = _normalize_frequency(frequency)

    months = round(years * 12)
    if months < 1:
        raise ValueError("time period must be at least one month (0.0833 years)")
    if months > MAX_MONTHS:
        raise ValueError(f"time period too large; maximum is {MAX_MONTHS // 12} years")

    periods_per_year = FREQUENCY_PERIODS[freq]
    periodic_rate = annual_rate_percent / 100 / periods_per_year
    effective_annual = (1 + periodic_rate) ** periods_per_year - 1
    monthly_rate = (1 + effective_annual) ** (1 / 12) - 1 if effective_annual else 0.0

    balance = principal
    total_contributions = principal
    for _ in range(months):
        balance *= 1 + monthly_rate
        balance += monthly_contribution
        total_contributions += monthly_contribution

    final_balance = round(balance, 2)
    contributed = round(total_contributions, 2)
    interest = round(final_balance - contributed, 2)

    return {
        "initial_deposit": round(principal, 2),
        "monthly_contribution": round(monthly_contribution, 2),
        "annual_rate_percent": round(annual_rate_percent, 4),
        "compounding_frequency": freq,
        "years": round(years, 4),
        "months": months,
        "effective_annual_rate_percent": round(effective_annual * 100, 4),
        "final_balance": final_balance,
        "total_contributions": contributed,
        "total_interest_earned": interest,
    }


def compound_interest_calculator() -> str:
    """Prompt for all inputs and return the projection as a JSON string."""
    print("Compound interest calculator (annual rate is a percentage, e.g. 5.5)")
    principal = _prompt_float("1. Initial deposit", minimum=0.0)
    monthly_contribution = _prompt_float(
        "2. Monthly contribution", minimum=0.0, default=0.0
    )
    annual_rate = _prompt_float("3. Annual interest rate (%)", minimum=0.0)
    frequency = _prompt_frequency()
    years = _prompt_float("5. Time period (years)", minimum=1 / 12, default=10.0)

    result = project(
        principal=principal,
        monthly_contribution=monthly_contribution,
        annual_rate_percent=annual_rate,
        frequency=frequency,
        years=years,
    )
    return json.dumps(result, indent=2)


def main(argv: list[str] | None = None) -> int:
    extra = sys.argv[1:] if argv is None else argv
    if extra:
        print(
            f"error: this tool takes no arguments (got: {' '.join(extra)}); "
            "it prompts for values interactively",
            file=sys.stderr,
        )
        return 2

    try:
        payload = compound_interest_calculator()
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except KeyboardInterrupt:
        print("\naborted", file=sys.stderr)
        return 130

    print(payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())