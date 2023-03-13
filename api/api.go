package api

import (
	"bufio"
	"context"
	"encoding/csv"
	"encoding/xml"
	"fmt"
	"gopms/db"
	"gopms/ent"
	"gopms/ent/perms"
	"io/ioutil"
	"math"
	"os"
	"time"

	"net/http"

	"github.com/gofiber/fiber/v2"
)

var ctx = context.Background()

type item struct {
	GuyukCdNm        string  `xml:"guyukCdNm"`
	JimokCd          string  `xml:"jimokCd"`
	JiyukCd          string  `xml:"jiyukCd"`
	JiguCd           string  `xml:"jiguCd"`
	GuyukCd          string  `xml:"guyukCd"`
	ArchGbCdNm       string  `xml:"archGbCdNm"`
	ArchGbCd         string  `xml:"archGbCd"`
	PlatArea         float32 `xml:"platArea"`
	ArchArea         float32 `xml:"archArea"`
	BcRat            float32 `xml:"bcRat"`
	TotArea          float32 `xml:"totArea"`
	VlRatEstmTotArea float32 `xml:"vlRatEstmTotArea"`
	VlRat            float32 `xml:"vlRat"`
	MainBldCnt       uint16  `xml:"mainBldCnt"`
	AtchBldDongCnt   uint16  `xml:"atchBldDongCnt"`
	MainPurpsCd      string  `xml:"mainPurpsCd"`
	MainPurpsCdNm    string  `xml:"mainPurpsCdNm"`
	HhldCnt          uint16  `xml:"hhldCnt"`
	HoCnt            uint16  `xml:"hoCnt"`
	FmlyCnt          uint16  `xml:"fmlyCnt"`
	TotPkngCnt       uint16  `xml:"totPkngCnt"`
	StcnsSchedDay    string  `xml:"stcnsSchedDay"`
	StcnsDelayDay    string  `xml:"stcnsDelayDay"`
	RealStcnsDay     string  `xml:"realStcnsDay"`
	ArchPmsDay       string  `xml:"archPmsDay"`
	UseAprDay        string  `xml:"useAprDay"`
	CrtnDay          string  `xml:"crtnDay"`
	Rnum             uint16  `xml:"rnum"`
	PlatPlc          string  `xml:"platPlc"`
	SigunguCd        string  `xml:"sigunguCd"`
	BjdongCd         string  `xml:"bjdongCd"`
	PlatGbCd         string  `xml:"platGbCd"`
	Bun              string  `xml:"bun"`
	Ji               string  `xml:"ji"`
	MgmPmsrgstPk     string  `xml:"mgmPmsrgstPk"`
	BldNm            string  `xml:"bldNm"`
	SplotNm          string  `xml:"splotNm"`
	Block            string  `xml:"block"`
	Lot              string  `xml:"lot"`
	JimokCdNm        string  `xml:"jimokCdNm"`
	JiyukCdNm        string  `xml:"jiyukCdNm"`
	JiguCdNm         string  `xml:"jiguCdNm"`
}

type permsXmlResponse struct {
	// XMLName xml.Name `xml:"response"`
	// Header  string   `xml:"header"`
	Items []item `xml:"body>items>item"`
}

// 공공데이터 apiKey
const apiKey = "GO8tFIo30%2BUG6NoXSzlVzxv2j8eQFigKu9a8RJ9qY47kAnl2u27pVjWIDlvlZ09Yo3NNJeyRt3UJovtQ5Z11ew%3D%3D"

func GetPermsData(code, startDate, endDate string) error {

	url := "http://apis.data.go.kr/1613000/ArchPmsService_v2/getApBasisOulnInfo"
	url += "?sigunguCd=" + code[0:5]
	url += "&bjdongCd=" + code[5:]
	url += "&numOfRows=1000"
	url += "&pageNo=1"
	url += "&startDate=" + startDate
	url += "&endDate=" + endDate
	url += "&serviceKey=" + apiKey

	fmt.Println("apiurl: ", url)

	resp, err := http.Get(url)

	if err != nil {
		fmt.Println("인허가정보 API 요청 중 오류가 발생했습니다. " + err.Error())
		return err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("인허가정보 API 요청 중 오류가 발생했습니다. " + err.Error())
		return err
	}

	var response permsXmlResponse

	xmlerr := xml.Unmarshal(body, &response)
	if xmlerr != nil {
		fmt.Println("xml 파싱 중 오류가 발생했습니다. " + xmlerr.Error())
		return err
	}

	if response.Items == nil {
		fmt.Println("xml 아이템이 없습니다.")
		return nil
	}
	fmt.Println("결과: ", response.Items[0])

	ctx := context.Background()

	bulk := make([]*ent.PermsCreate, len(response.Items))

	for key, val := range response.Items {
		bulk[key] = db.Client.Perms.Create().SetArchArea(uint32(val.ArchArea)).
			SetArchArea(uint32(val.ArchArea)).
			SetArchGBCd(val.ArchGbCd).
			SetArchGBCdNm(val.ArchGbCdNm).
			SetArchPmsDay(val.ArchPmsDay).
			SetAtchBldDongCnt(uint16(val.AtchBldDongCnt)).
			SetBcRat(uint16(val.BcRat)).
			SetBjdongCd(val.BjdongCd).
			SetBldNm(val.BldNm).
			SetBlock(val.Block).
			SetBun(val.Bun).
			SetCrtnDay(val.CrtnDay).
			SetFmlyCnt(val.FmlyCnt).
			SetGuyukCd(val.GuyukCd).
			SetGuyukCdNm(val.GuyukCdNm).
			SetHhldCnt(val.HhldCnt).
			SetHoCnt(val.HoCnt).
			SetJi(val.Ji).
			SetJiguCd(val.JiguCd).
			SetJiguCdNm(val.JiguCdNm).
			SetJimokCd(val.JimokCd).
			SetJiguCdNm(val.JiguCdNm).
			SetJiyukCd(val.JiyukCd).
			SetJiyukCdNm(val.JiyukCdNm).
			SetLot(val.Lot).
			SetMainBldCnt(val.MainBldCnt).
			SetMainPurpsCd(val.MainPurpsCd).
			SetMainPurpsCdNm(val.MainPurpsCdNm).
			SetMgmPmsrgstPk(val.MgmPmsrgstPk).
			SetPlatArea(uint32(val.PlatArea)).
			SetPlatGBCd(val.PlatGbCd).
			SetPlatPlc(val.PlatPlc).
			SetRealStcnsDay(val.RealStcnsDay).
			SetRnum(val.Rnum).
			SetSigunguCd(val.SigunguCd).
			SetSplotNm(val.SplotNm).
			SetStcnsDelayDay(val.StcnsDelayDay).
			SetStcnsSchedDay(val.StcnsSchedDay).
			SetTotArea(uint32(val.TotArea)).
			SetTotPkngCnt(val.TotPkngCnt).
			SetVlRat(uint16(val.VlRat)).
			SetVlRatEstmTotArea(uint32(val.VlRatEstmTotArea)).
			SetUseAprDay(val.UseAprDay).
			SetJimokCdNm(val.JiguCdNm)

		// db.Client.Perms.Create().
		// 	SetArchArea(uint32(val.ArchArea)).
		// 	SetArchGBCd(val.ArchGbCd).
		// 	SetArchGBCdNm(val.ArchGbCdNm).
		// 	SetMgmPmsrgstPk(val.MgmPmsrgstPk).
		// 	SaveX(ctx)

		// fmt.Println(key, "번 저장완료, ", val)
	}
	_, enterr := db.Client.Perms.CreateBulk(bulk...).Save(ctx)
	if enterr != nil {
		fmt.Println("db 저장중 오류가 발생했습니다. " + enterr.Error())
		return enterr
	}

	return nil
}

func GetPermsDataFromCSV(startDate, endDate string) error {
	fmt.Println("시작")
	// 파일 오픈
	file, err := os.Open("./api/dong_code.csv")
	if err != nil {
		fmt.Println("법정동코드 csv 코드를 여는 중 오류가 발생했습니다. " + err.Error())
		return err
	}
	defer file.Close()

	// csv reader 생성
	rdr := csv.NewReader(bufio.NewReader(file))

	// csv 내용 모두 읽기
	rows, _ := rdr.ReadAll()
	fmt.Println("rows: ", rows)
	// 행,열 읽기
	for i, row := range rows {
		code := row[0]
		err := GetPermsData(code, startDate, endDate)
		if err != nil {
			fmt.Println(i+1, "번째, 법정동코드: ", code, " 에서 오류가 발생했습니다.", err.Error())
		} else {
			fmt.Println(i+1, "번째, 법정동코드: ", code, " 완료했습니다.")
		}
		time.Sleep(3 * time.Second)
	}

	return nil
}

// DB에서 인허가정보를 조회하여 클라이언트에 보내줍니다.
func GetPermsDataAPI(c *fiber.Ctx) error {
	sido := c.Query("sido", "")
	permsType := c.Query("permsType", "")
	totAreaGt := c.QueryInt("totAreaGt", 0)

	page := c.QueryInt("page", 1)
	cnt := 10

	instance := db.Client.Perms.Query()
	if sido != "" && permsType == "" { // sido(지역)에 대한 조건이 있으면 where절을 추가합니다.
		instance = instance.Where(
			perms.And(
				perms.SigunguCdHasPrefix(sido),
				perms.TotAreaGTE(uint32(totAreaGt)),
			),
		)
	} else if sido != "" && permsType != "" {
		instance = instance.Where(
			perms.And(
				perms.SigunguCdHasPrefix(sido),
				perms.ArchGBCdNmEQ(permsType),
				perms.TotAreaGTE(uint32(totAreaGt)),
			),
		)
	} else if sido == "" && totAreaGt > 0 {
		instance = instance.Where(perms.TotAreaGTE(uint32(totAreaGt)))
	} else if sido == "" && permsType != "" {
		instance = instance.Where(perms.ArchGBCdNmEQ(permsType))
	}

	instance = instance.Order(ent.Desc(perms.FieldMgmPmsrgstPk))

	totalCnt, err := instance.Count(ctx)
	if err != nil {
		fmt.Println("전체 인허가 정보수 쿼리중 에러가 발생했습니다. " + err.Error())
		return c.JSON(fiber.NewError(fiber.StatusInternalServerError, "전체 인허가 정보수를 쿼라하던 중 에러가 발생했습니다. "+err.Error()))
	}

	totalPage := math.Ceil(float64(totalCnt) / float64(cnt))

	perms, err := instance.Offset((page - 1) * cnt).Limit(cnt).All(ctx)

	if err != nil {
		fmt.Println("인허가정보 쿼리중 에러가 발생했습니다. " + err.Error())
		return c.JSON(fiber.NewError(fiber.StatusBadRequest, "인허가정보 쿼리중 에러가 발생했습니다. "+err.Error()))
	}

	return c.JSON(
		fiber.Map{
			"status":     fiber.StatusOK,
			"msg":        "인허가 정보를 성공적으로 불러왔습니다.",
			"total_page": totalPage,
			"total_cnt":  totalCnt,
			"page":       page,
			"cnt":        cnt,
			"result":     perms,
		})

}
