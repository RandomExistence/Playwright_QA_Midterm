> [!IMPORTANT]
> **From Project Author (Random Existence):**
>
> When executing many tests at a time, it is advisable to run:
>
> `set TEST_TIMEOUT=90000 && npx playwright test --workers=2`
>
> rather than just `npx playwright test`. 
> 
> *Note: Sometimes `goto()` fails to navigate due to hardware or network constraints.*