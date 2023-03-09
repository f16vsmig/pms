package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Jibun holds the schema definition for the Jibun entity.
type Jibun struct {
	ent.Schema
}

// Fields of the Jibun.
func (Jibun) Fields() []ent.Field {
	return []ent.Field{
		field.String("bjdong_cd"),  // 법정동코드
		field.String("sigungu_cd"), // 시군구코드
		field.String("bun"),        // 번
		field.String("ji"),         // 지

		field.String("guyuk_cd"),    // 구역코드
		field.String("guyuk_cd_nm"), // 구역코드명
		field.String("jimok_cd"),    // 지목코드
		field.String("jimok_cd_nm"), // 지목코드명
		field.String("jiyuk_cd"),    // 지역코드
		field.String("jiyuk_cd_nm"), // 지역코드명
		field.String("jigu_cd"),     // 지구코드
		field.String("jigu_cd_nm"),  // 지구코드명
		field.String("plat_gb_cd"),  // 대지구분코드
		field.String("plat_plc"),    // 대지위치
		field.String("splot_nm"),    // 특수지명
		field.String("block"),       // 블록
		field.String("lot"),         // 로트
		field.Time("created_at").
			Default(time.Now).
			Immutable(), // 생성일자
		field.Time("updated_at").
			Default(time.Now), // 업데이트일자
	}
}

// Edges of the Jibun.
func (Jibun) Edges() []ent.Edge {
	return []ent.Edge{
		// edge.To("perms", Perms.Type),
		edge.To("demol", Demol.Type),
	}
}
