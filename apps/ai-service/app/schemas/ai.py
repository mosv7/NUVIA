"""Model-independent version-one wire contracts."""

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, create_model, model_validator

Text = Annotated[str, StringConstraints(strict=True, min_length=1, max_length=2000)]
Short = Annotated[str, StringConstraints(strict=True, min_length=1, max_length=1000)]
Identifier = Annotated[str, StringConstraints(pattern=r"^[A-Za-z0-9_-]{1,64}$")]
Locale = Literal["ar", "en"]
Polarity = Literal["positive", "negative", "neutral"]
OPERATIONS = ("analyze", "summaries", "reports", "survey-suggestions", "answers")


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True, allow_inf_nan=False)

    @model_validator(mode="after")
    def reject_blank_strings(self):
        if any(isinstance(value, str) and not value.strip() for value in self.__dict__.values()):
            raise ValueError("Blank string")
        return self


class Evidence(Strict):
    id: Identifier
    text: Text

    @model_validator(mode="after")
    def nonblank(self):
        if not self.text.strip():
            raise ValueError("Blank text")
        return self


class AnalyzeRequest(Strict):
    texts: Annotated[list[Evidence], Field(min_length=1, max_length=10)]

    @model_validator(mode="after")
    def unique(self):
        if len({t.id for t in self.texts}) != len(self.texts):
            raise ValueError("Duplicate evidence IDs")
        return self


class SummaryRequest(AnalyzeRequest):
    locale: Locale


class ReportRequest(SummaryRequest):
    objective: Short | None = None


class AnswerRequest(SummaryRequest):
    question: Short


class SurveyRequest(Strict):
    industry: Short
    objective: Short
    locale: Locale
    count: Annotated[int, Field(ge=5, le=10)] = 5


REQUESTS = dict(
    zip(
        OPERATIONS,
        [AnalyzeRequest, SummaryRequest, ReportRequest, SurveyRequest, AnswerRequest],
        strict=True,
    )
)


class Citation(Strict):
    id: Identifier
    quote: Text


class Claim(Strict):
    text: Text
    citations: Annotated[list[Citation], Field(min_length=1, max_length=10)]


class Summary(Strict):
    items: Annotated[list[Claim], Field(min_length=1, max_length=10)]


class Recommendation(Strict):
    suggestion: Text
    citations: Annotated[list[Citation], Field(min_length=1, max_length=10)]


class Report(Strict):
    strengths: Annotated[list[Claim], Field(max_length=10)]
    problems: Annotated[list[Claim], Field(max_length=10)]
    suggested_actions: Annotated[list[Recommendation], Field(max_length=10)]


class Answer(Strict):
    status: Literal["answered", "insufficient_evidence"]
    items: Annotated[list[Claim], Field(max_length=10)]


class Question(Strict):
    text: Short
    type: Literal["text", "rating"]


class Survey(Strict):
    questions: Annotated[list[Question], Field(min_length=5, max_length=10)]


RESULTS = {"summaries": Summary, "reports": Report, "answers": Answer, "survey-suggestions": Survey}


class Mention(Strict):
    id: Identifier
    text: Text
    start: Annotated[int, Field(ge=0)]
    end: Annotated[int, Field(gt=0)]
    sentiment: Polarity
    score: Annotated[float, Field(ge=0, le=1)]
    extraction_score: Annotated[float, Field(ge=0, le=1)]
    accepted: bool


class Analysis(Strict):
    id: Identifier
    sentiment: Literal["positive", "negative", "neutral", "mixed"] | None
    reason: Literal["insufficient_evidence"] | None
    method: Literal["aspect_derived"]
    coverage: Literal["partial_aspects"]
    mentions: Annotated[list[Mention], Field(max_length=100)]
    contributing_ids: list[Identifier]
    excluded_count: Annotated[int, Field(ge=0)]


class Analyses(Strict):
    items: Annotated[list[Analysis], Field(min_length=1, max_length=10)]


RESULTS["analyze"] = Analyses

Digest = Annotated[str, StringConstraints(pattern=r"^[a-f0-9]{64}$")]
Alias = Annotated[str, StringConstraints(pattern=r"^[A-Za-z0-9_.-]{1,100}$")]


class Capability(Strict):
    ready: bool
    reason: (
        Literal[
            "package_unavailable",
            "inference_dependencies_missing",
            "unverified_input_format",
            "unassessed",
            "service_not_configured",
        ]
        | None
    )
    models: Annotated[list[Alias], Field(max_length=3)]
    profile: Digest
    quality_status: Literal["accepted", "baseline", "unavailable"]
    quality_accepted: bool
    warnings: list[Literal["experimental_baseline", "quality_not_accepted"]]


CapabilityMap = create_model(
    "CapabilityMap", __base__=Strict, **{name: (Capability, ...) for name in OPERATIONS}
)


class Capabilities(Strict):
    schema_version: Literal["1"]
    capabilities: CapabilityMap


class Provenance(Strict):
    models: Annotated[list[Alias], Field(min_length=1, max_length=3)]
    profile: Digest
    prompt_version: Literal["extractive-v1", "baseline-extractive-v1", "baseline-extractive-v2"]
    method_version: Literal["aspects-v1"]
    scores: Literal["uncalibrated"]
    quality_status: Literal["accepted", "baseline"]
    quality_accepted: bool
    warnings: list[Literal["experimental_baseline", "quality_not_accepted"]]


RESPONSES = {
    operation: create_model(
        operation.replace("-", "_") + "_response",
        __base__=Strict,
        schema_version=(Literal["1"], ...),
        operation=(Literal[operation], ...),
        request_id=(Annotated[str, StringConstraints(pattern=r"^[a-f0-9-]{36}$")], ...),
        provenance=(Provenance, ...),
        result=(result, ...),
    )
    for operation, result in RESULTS.items()
}
