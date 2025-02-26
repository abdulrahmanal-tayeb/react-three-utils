import { cloneElement, CSSProperties, ForwardedRef, forwardRef, isValidElement, ReactElement, ReactNode, RefObject, useLayoutEffect, useMemo, useRef } from "react";
import { useOverlays } from "../stores/Overlays";
import { OverlayProps, OverlaysProps } from "../../types/layout/Overlays";


/**
 * The base overlay, this basically wraps the entire groups of overlays
 * so they appear on top of the `Canvas`
 */
export const Overlays = forwardRef((
    {
        style,
        className,
        children,
        id
    }: OverlaysProps,
    ref: ForwardedRef<HTMLDivElement>
) => {

    const styles = useMemo(() => {
        const defaultStyles = {
            position: "fixed",
            width: "100dvw",
            height: "100dvh",
        } as CSSProperties;

        return {
            ...defaultStyles,
            ...(style ?? {})
        }
    }, [style]);


    return (
        <div
            ref={ref}
            id={id}
            className={className}
            style={styles}
        >
            {children}
        </div>
    );
})



/**
 * Subscribes an Html element to the centralized store that contains other overlays for animation purposes.
 * 
 * **This will not create any additional node or wrap the children with any element.** What that does is that
 * it attaches a reference to the children node and passes it to the centralized store, which allows the developer
 * to fully take control over any prop they want on that node.
 */
export function Overlay({
    children,
    id,
}: OverlayProps) {
    const ref = useRef<ReactElement | ReactNode>(null);
    const updateOverlays = useOverlays((state) => state.updateOverlays);

    useLayoutEffect(() => {
        if (ref) {
            updateOverlays(id, ref);
        }
    }, []);

    return isValidElement(children) ? (
        cloneElement(
            children,
            {
                ref,
            } as {
                ref: RefObject<ReactElement | ReactNode>
            }
        )
    ) : null;
}