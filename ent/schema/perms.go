package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Perms holds the schema definition for the Perms entity.
type Perms struct {
	ent.Schema
}

// Fields of the Perms.
func (Perms) Fields() []ent.Field {
	return []ent.Field{
		field.String("guyukCd").
			Optional(), // 구역코드
		field.String("guyukCdNm").
			Optional(), // 구역코드명
		field.String("jimokCd").
			Optional(), // 지목코드
		field.String("jimokCdNm").
			Optional(), // 지목코드명
		field.String("jiyukCd").
			Optional(), // 지역코드
		field.String("jiyukCdNm").
			Optional(), // 지역코드명
		field.String("jiguCd").
			Optional(), // 지구코드
		field.String("jiguCdNm").
			Optional(), // 지구코드명
		field.String("arch_gb_cd_nm").
			Optional().
			StructTag(`xml:"archGbCdNm"`), // 건축구분코드명
		field.String("arch_gb_cd").
			Optional().
			StructTag(`xml:"archGbCd"`), // 건축구분코드
		field.Uint32("plat_area").
			Optional().
			StructTag(`xml:"plat_area"`), // 대지면적[m2]
		field.Uint32("arch_area").
			Optional().
			StructTag(`xml:"arch_area"`), // 건축면적[m2]
		field.Uint16("bc_rat").
			Optional().
			StructTag(`xml:"bc_rat"`), // 건폐율
		field.Uint32("tot_area").
			Optional().
			StructTag(`xml:"tot_area"`), // 연면적
		field.Uint32("vl_rat_estm_tot_area").
			Optional().
			StructTag(`xml:"vl_rat_estm_tot_area"`), // 용적율 산정 면적
		field.Uint16("vl_rat").
			Optional().
			StructTag(`xml:"vl_rat"`), // 용적률[%]
		field.Uint16("main_bld_cnt").
			Optional().
			StructTag(`xml:"main_bld_cnt"`), // 주건축물수
		field.Uint16("atch_bld_dong_cnt").
			Optional().
			StructTag(`xml:"atch_bld_dong_cnt"`), // 부속건축물수
		field.String("main_purps_cd").
			Optional().
			StructTag(`xml:"main_purps_cd"`), // 주용도코드
		field.String("main_purps_cd_nm").
			Optional().
			StructTag(`xml:"main_purps_cd_nm"`), // 주용도코드명
		field.Uint16("hhld_cnt").
			Optional().
			StructTag(`xml:"hhld_cnt"`), // 세대수
		field.Uint16("ho_cnt").
			Optional().
			StructTag(`xml:"ho_cnt"`), // 호수
		field.Uint16("fmly_cnt").
			Optional().
			StructTag(`xml:"fmly_cnt"`), // 가구수
		field.Uint16("tot_pkng_cnt").
			Optional().
			StructTag(`xml:"tot_pkng_cnt"`), // 총주차대수
		field.String("stcns_sched_day").
			Optional().
			StructTag(`xml:"stcns_sched_day"`), // 착공예정일
		field.String("stcns_delay_day").
			Optional().
			StructTag(`xml:"stcns_delay_day"`), // 착공연기일
		field.String("real_stcns_day").
			Optional().
			StructTag(`xml:"real_stcns_day"`), // 실제착공일
		field.String("arch_pms_day").
			Optional().
			StructTag(`xml:"arch_pms_day"`), // 건축허가일
		field.String("use_apr_day").
			Optional().
			StructTag(`xml:"use_apr_day"`), // 사용승인일
		field.String("platPlc").
			Optional(), // 대지위치
		field.String("sigunguCd").
			Optional(), // 시군구코드
		field.String("bjdongCd").
			Optional(), // 법정동코드
		field.String("platGbCd").
			Optional(), // 대지구분코드
		field.String("bun").
			Optional(), // 번
		field.String("ji").
			Optional(), // 지
		field.String("mgm_pmsrgst_pk").
			StructTag(`xml:"mgmPmsrgstPk"`).
			Unique(), // 관리허가대장pk
		field.String("splotNm").
			Optional(), // 특수지명
		field.String("block").
			Optional(), // 블록
		field.String("lot").
			Optional(), // 로트
		field.String("crtn_day").
			Optional().
			StructTag(`xml:"crtn_day"`), // 생성일
		field.Uint16("rnum").
			Optional().
			StructTag(`xml:"rnum"`), // 순번
		field.String("bld_nm").
			Optional().
			StructTag(`xml:"bld_nm"`), // 건물명
		field.Time("created_at").
			Default(time.Now).
			Immutable(), // 생성일자
		field.Time("updated_at").
			Default(time.Now), // 업데이트일자
	}
}

// Edges of the Perms.
func (Perms) Edges() []ent.Edge {
	return nil
}
