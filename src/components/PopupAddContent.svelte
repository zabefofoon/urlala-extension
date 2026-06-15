<script lang="ts"></script>

<div class="flex-1 flex flex-col">
  <div class="px-3">
    <table
      class=" border-spacing-y-2 border-spacing-x-0 w-full border-separate"
    >
      <tbody>
        <tr>
          <td>이름</td>
          <td>
            <input placeholder="이름" />
          </td>
        </tr>
        <tr>
          <td class="align-top">Url</td>
          <td>
            <textarea placeholder="Url"></textarea>
          </td>
        </tr>
        <tr>
          <td class="align-top">메모</td>
          <td>
            <textarea placeholder="메모"></textarea>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="mt-auto border-t border-border flex items-cener py-2 gap-1 px-3">
    <button type="button" class="ml-auto py-1 px-2 flex items-center">
      <span class="text-[12px] leading-[100%] text-text-secondary"> 취소 </span>
    </button>
    <button
      type="button"
      class="py-1.5 px-3 bg-primary text-white rounded-full flex items-center"
    >
      <span class="text-[12px] leading-[100%]"> 추가 </span>
    </button>
  </div>
</div>
