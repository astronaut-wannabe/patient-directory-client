import {
  JSORMBase,
  Model,
  Attr,
  HasOne,
  BelongsTo
} from "jsorm"

@Model()
export class ApplicationRecord extends JSORMBase {
  static baseUrl = "https://calm-inlet-89562.herokuapp.com/"
  static apiNamespace = "api/v1"
}

@Model()
export class Patient extends ApplicationRecord {
  static jsonapiType = "patients"

  @Attr() username: string
  @Attr() email: string
  @Attr() dateOfBirth: string

  @HasOne() stateLicense: StateLicense
  @HasOne() medicalRecommendation: MedicalRecommendation

}

@Model()
export class MedicalRecommendation extends ApplicationRecord {
  static jsonapiType = "medical_recommendations"

    @Attr() recNumber: string
    @Attr() issuer: string
    @Attr() state: string
    @Attr() expiresAt: string
    @Attr() expired: boolean
    @Attr() imagePath: string
    
    @BelongsTo() patient: Patient
}

@Model()
export class StateLicense extends ApplicationRecord {
  static jsonapiType = "state_licenses"

    @Attr() "number": string
    @Attr() state: string
    @Attr() expiresAt: string
    @Attr() expired: string
    @Attr() imagePath: string

    @BelongsTo() patient: Patient
}

@Model()
export class UsaState extends ApplicationRecord {
  static jsonapiType = "usa_states"

    @Attr() uspsAbbreviation: string
    @Attr() fullName: string
    @Attr() expiresAt: string
    @Attr() timezone: string
}
