package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Bjd holds the schema definition for the Bjd entity.
type Bjd struct {
	ent.Schema
}

// Fields of the Bjd.
func (Bjd) Fields() []ent.Field {
	return []ent.Field{
		field.String("bjdong_cd"),  // 법정동코드
		field.String("sigungu_cd"), // 시군구코드
		field.String("sido_nm"),    // 시도명
		field.String("sigungu_nm"), // 시군구명
		field.String("dong_nm"),    // 읍면동명
		field.String("li_nm"),      // 리명
		field.Time("created_at").
			Default(time.Now).
			Immutable(), // 생성일자
		field.Time("updated_at").
			Default(time.Now), // 업데이트일자
	}
}

// Edges of the Bjd.
func (Bjd) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("jibun", Jibun.Type),
	}
}
