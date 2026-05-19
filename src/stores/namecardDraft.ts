// src/stores/namecardDraft.ts
import { defineStore } from 'pinia'

export type NamecardDraft = {
  name: string
  phone: string
  address: string
  category: string

  // ✅ 네가 말한 매핑
  // description = 홍보문구
  promoText: string

  // keyword = 키워드
  keywords: string[]

  region?: string
  org?: string
  social?: string
  contactType?: string
  contactValue?: string
  recommender?: string

  imageDataUrl?: string // 선택: 이미지 프리뷰(데이터URL)로 넘기고 싶을 때
}

export const useNamecardDraftStore = defineStore('namecardDraft', {
  state: () => ({
    draft: null as NamecardDraft | null,
  }),
  actions: {
    setDraft(payload: NamecardDraft) {
      this.draft = payload
    },
    clearDraft() {
      this.draft = null
    },
  },
})